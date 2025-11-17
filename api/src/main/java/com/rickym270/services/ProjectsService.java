package com.rickym270.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rickym270.clients.GitHubClient;
import com.rickym270.config.FeatureFlags;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.env.Environment;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for managing projects data, integrating curated JSON with GitHub API data.
 * 
 * Features:
 * - Feature flag support to disable GitHub integration in CI
 * - TTL-based caching of GitHub repository data to reduce API calls
 * - Automatic fallback to curated-only data on failures
 * - Rate limit handling for per-repo commit status checks
 * 
 * The service uses a feature flag (FEATURE_GITHUB_PROJECT_SYNC) to control whether
 * GitHub API calls are made. When disabled, only curated projects are returned.
 * 
 * GitHub data is cached with a configurable TTL (PROJECTS_GITHUB_TTL_MINUTES, default: 360 minutes).
 * If a GitHub fetch fails but cached data exists, stale cache is used.
 */
@Service
public class ProjectsService {

    private static final String GITHUB_USER = "rickym270";
    
    private final FeatureFlags featureFlags;
    private final GitHubClient gitHubClient;
    private final Environment env;
    
    // Cache for GitHub repos
    private volatile List<Map<String, Object>> cachedGithubRepos;
    private volatile Instant lastGithubFetch;
    
    public ProjectsService(FeatureFlags featureFlags, GitHubClient gitHubClient, Environment env) {
        this.featureFlags = featureFlags;
        this.gitHubClient = gitHubClient;
        this.env = env;
        this.cachedGithubRepos = null;
        this.lastGithubFetch = null;
    }
    
    /**
     * Get all projects, merging curated and GitHub data.
     * 
     * @param source Optional query param: "curated" to return only curated projects
     * @return List of merged project maps
     */
    public List<Map<String, Object>> getProjects(String source) {
        // Load curated projects from classpath
        List<Map<String, Object>> curatedProjects = readCuratedProjects();
        
        // Allow curated-only mode for debugging or when GitHub API is unavailable
        if ("curated".equalsIgnoreCase(source)) {
            return curatedProjects;
        }
        
        // Check feature flag
        if (!featureFlags.githubProjectSyncEnabled()) {
            return curatedProjects;
        }
        
        // Get GitHub repos (with caching)
        List<Map<String, Object>> githubProjects = getGithubRepos();
        
        if (githubProjects == null || githubProjects.isEmpty()) {
            // Return curated list if GitHub call fails or returns nothing
            return curatedProjects;
        }
        
        try {
            return mergeProjects(curatedProjects, githubProjects);
        } catch (Exception unexpected) {
            // Defensive fallback: if anything in merge fails, return curated list only
            System.err.println("[ProjectsService] Unexpected error during merge: " + unexpected.getMessage());
            unexpected.printStackTrace();
            return curatedProjects;
        }
    }
    
    /**
     * Get GitHub repositories with TTL-based caching.
     * Thread-safe cache updates using synchronized blocks.
     */
    private List<Map<String, Object>> getGithubRepos() {
        // Check if cache is fresh
        if (cachedGithubRepos != null && lastGithubFetch != null) {
            long ttlMinutes = getTtlMinutes();
            Instant cacheExpiry = lastGithubFetch.plus(ttlMinutes, ChronoUnit.MINUTES);
            if (Instant.now().isBefore(cacheExpiry)) {
                // Cache is fresh, use it
                return cachedGithubRepos;
            }
        }
        
        // Cache is stale or empty, fetch fresh data
        synchronized (this) {
            // Double-check after acquiring lock
            if (cachedGithubRepos != null && lastGithubFetch != null) {
                long ttlMinutes = getTtlMinutes();
                Instant cacheExpiry = lastGithubFetch.plus(ttlMinutes, ChronoUnit.MINUTES);
                if (Instant.now().isBefore(cacheExpiry)) {
                    return cachedGithubRepos;
                }
            }
            
            try {
                List<Map<String, Object>> repos = gitHubClient.fetchUserRepos(GITHUB_USER);
                if (repos != null && !repos.isEmpty()) {
                    cachedGithubRepos = repos;
                    lastGithubFetch = Instant.now();
                    return repos;
                } else {
                    // Fetch returned empty, but if we have stale cache, use it
                    if (cachedGithubRepos != null) {
                        System.out.println("[ProjectsService] GitHub fetch returned empty, using stale cache");
                        return cachedGithubRepos;
                    }
                    return Collections.emptyList();
                }
            } catch (Exception e) {
                System.err.println("[ProjectsService] Failed to fetch GitHub repos: " + e.getMessage());
                // If we have stale cache, use it
                if (cachedGithubRepos != null) {
                    System.out.println("[ProjectsService] GitHub fetch failed, using stale cache");
                    return cachedGithubRepos;
                }
                return Collections.emptyList();
            }
        }
    }
    
    /**
     * Get TTL in minutes from environment, defaulting to 360 (6 hours)
     */
    private long getTtlMinutes() {
        String ttlStr = env.getProperty("PROJECTS_GITHUB_TTL_MINUTES");
        if (ttlStr == null || ttlStr.trim().isEmpty()) {
            return 360; // Default 6 hours
        }
        try {
            return Long.parseLong(ttlStr.trim());
        } catch (NumberFormatException e) {
            System.err.println("[ProjectsService] Invalid PROJECTS_GITHUB_TTL_MINUTES value: " + ttlStr + ", using default 360");
            return 360;
        }
    }
    
    /**
     * Merge curated and GitHub projects
     */
    private List<Map<String, Object>> mergeProjects(
            List<Map<String, Object>> curatedProjects,
            List<Map<String, Object>> githubProjects) {
        
        // Index curated by repo name (derived from the repo URL) for easy merging
        Map<String, Map<String, Object>> curatedByRepo = curatedProjects.stream()
            .filter(p -> p.get("repo") instanceof String)
            .collect(Collectors.toMap(
                p -> normalizeRepoName(extractRepoNameFromUrl((String) p.get("repo"))),
                p -> p,
                (a, b) -> a
            ));
        
        // Rate limit flag for this request (reset per request)
        boolean[] rateLimitHit = {false};
        
        // Merge: start from GitHub data and overlay curated fields when present
        List<Map<String, Object>> merged = githubProjects.stream()
            .map(gh -> {
                try {
                    String repoName = normalizeRepoName(String.valueOf(gh.getOrDefault("name", "")));
                    Map<String, Object> base = mapGithubRepoToProject(gh, rateLimitHit);
                    Map<String, Object> override = curatedByRepo.get(repoName);
                    if (override != null) {
                        overlay(base, override);
                    }
                    return base;
                } catch (Exception e) {
                    System.err.println("[ProjectsService] Error mapping GitHub repo: " + e.getMessage());
                    e.printStackTrace();
                    return null;
                }
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
        
        // Add any curated projects that do not exist on GitHub (external or archived)
        Set<String> mergedNames = merged.stream()
            .map(p -> normalizeRepoName(String.valueOf(p.getOrDefault("name", ""))))
            .collect(Collectors.toSet());
        
        curatedProjects.stream()
            .filter(p -> p.get("repo") instanceof String)
            .filter(p -> !mergedNames.contains(normalizeRepoName(extractRepoNameFromUrl((String) p.get("repo")))))
            .forEach(project -> {
                try {
                    // For curated projects not on GitHub, check if we can infer activity from GitHub data
                    // If we have matching GitHub data but it wasn't merged, check its activity
                    String repoName = normalizeRepoName(extractRepoNameFromUrl((String) project.get("repo")));
                    Optional<Map<String, Object>> matchingGitHubRepo = githubProjects.stream()
                        .filter(gh -> normalizeRepoName(String.valueOf(gh.getOrDefault("name", ""))).equals(repoName))
                        .findFirst();
                    
                    if (matchingGitHubRepo.isPresent()) {
                        Map<String, Object> ghRepo = matchingGitHubRepo.get();
                        boolean hasRecentActivity = checkRecentActivity(ghRepo);
                        project.put("hasRecentActivity", hasRecentActivity);
                        // Calculate status from GitHub data
                        String status = calculateStatus(ghRepo, rateLimitHit);
                        project.put("status", status);
                    } else {
                        // No GitHub data available, assume no recent activity and complete status
                        project.put("hasRecentActivity", false);
                        project.putIfAbsent("status", "complete");
                    }
                    merged.add(project);
                } catch (Exception e) {
                    System.err.println("[ProjectsService] Error processing curated project: " + e.getMessage());
                    e.printStackTrace();
                    // Still add the project without activity info
                    project.put("hasRecentActivity", false);
                    project.putIfAbsent("status", "complete");
                    merged.add(project);
                }
            });
        
        // Sort featured first, then by name
        merged.sort(Comparator
            .comparing((Map<String, Object> p) -> !(Boolean.TRUE.equals(p.get("featured"))))
            .thenComparing(p -> String.valueOf(p.getOrDefault("name", "")).toLowerCase()));
        
        return merged;
    }
    
    /**
     * Read curated projects from classpath JSON file
     */
    private List<Map<String, Object>> readCuratedProjects() {
        ClassPathResource projectsJson = new ClassPathResource("data/projects.json");
        try (InputStream inputStream = projectsJson.getInputStream()) {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(
                inputStream,
                new TypeReference<List<Map<String, Object>>>() {}
            );
        } catch (IOException ignored) {
            return Collections.emptyList();
        }
    }
    
    /**
     * Map GitHub repo data to project format
     */
    private Map<String, Object> mapGithubRepoToProject(Map<String, Object> gh, boolean[] rateLimitHit) {
        String name = String.valueOf(gh.getOrDefault("name", ""));
        String description = Optional.ofNullable(gh.get("description"))
            .map(Object::toString).orElse("");
        String htmlUrl = Optional.ofNullable(gh.get("html_url"))
            .map(Object::toString).orElse("");
        String language = Optional.ofNullable(gh.get("language"))
            .map(Object::toString).orElse("");
        
        Map<String, Object> project = new LinkedHashMap<>();
        project.put("slug", toSlug(name));
        project.put("name", name);
        project.put("summary", description);
        project.put("repo", htmlUrl);
        if (language != null && !language.trim().isEmpty()) {
            project.put("tech", Collections.singletonList(language));
        }
        project.putIfAbsent("featured", Boolean.FALSE);
        
        // Check if project has recent activity (commits within last month)
        boolean hasRecentActivity = checkRecentActivity(gh);
        project.put("hasRecentActivity", hasRecentActivity);
        
        // Calculate status based on commit count (2+ commits in last 3 weeks = in-progress)
        String status = calculateStatus(gh, rateLimitHit);
        project.put("status", status);
        
        return project;
    }
    
    /**
     * Check if a GitHub repo has had commits/activity within the last month
     * Uses pushed_at field from GitHub API which indicates last push time
     */
    private boolean checkRecentActivity(Map<String, Object> gh) {
        try {
            Object pushedAtObj = gh.get("pushed_at");
            if (pushedAtObj == null) {
                return false;
            }
            
            String pushedAtStr = pushedAtObj.toString();
            if (pushedAtStr == null || pushedAtStr.trim().isEmpty()) {
                return false;
            }
            
            // Parse ISO 8601 datetime (e.g., "2024-10-15T10:30:00Z")
            Instant pushedAt = Instant.parse(pushedAtStr);
            Instant oneMonthAgo = Instant.now().minus(30, ChronoUnit.DAYS);
            
            // Return true if last push was within the last month
            return pushedAt.isAfter(oneMonthAgo);
        } catch (Exception e) {
            // If parsing fails, assume no recent activity
            return false;
        }
    }
    
    /**
     * Calculate project status based on commit count in last 3 weeks
     * 2+ commits = "in-progress", otherwise "complete"
     * @param gh - GitHub repo data
     * @param rateLimitHit - Array to track if rate limit was hit (shared across repos in one request)
     * @return Status string: "in-progress" or "complete"
     */
    private String calculateStatus(Map<String, Object> gh, boolean[] rateLimitHit) {
        try {
            String repoName = String.valueOf(gh.getOrDefault("name", ""));
            if (repoName == null || repoName.trim().isEmpty()) {
                return "complete";
            }
            
            // If rate limit was hit, skip API calls and use fallback
            if (rateLimitHit[0]) {
                if (checkRecentActivity(gh)) {
                    return "in-progress";
                }
                return "complete";
            }
            
            // Calculate cutoff date (3 weeks ago)
            Instant threeWeeksAgo = Instant.now().minus(21, ChronoUnit.DAYS);
            String since = threeWeeksAgo.toString(); // ISO 8601 format
            
            // Fetch commits from GitHub API
            // Check both GH_TOKEN and GITHUB_TOKEN (GitHub Actions uses GITHUB_TOKEN)
            String token = System.getenv("GH_TOKEN");
            if (token == null || token.trim().isEmpty()) {
                token = System.getenv("GITHUB_TOKEN");
            }
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            headers.set("X-GitHub-Api-Version", "2022-11-28");
            if (token != null && !token.trim().isEmpty()) {
                headers.set("Authorization", "Bearer " + token.trim());
            }
            
            HttpEntity<Void> request = new HttpEntity<>(headers);
            String commitsUrl = String.format("https://api.github.com/repos/%s/%s/commits?since=%s&per_page=100", 
                GITHUB_USER, repoName, since);
            
            try {
                List<Map<String, Object>> commits = new RestTemplate()
                    .exchange(commitsUrl, org.springframework.http.HttpMethod.GET, request,
                        new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                    .getBody();
                
                if (commits != null && commits.size() >= 2) {
                    return "in-progress";
                }
            } catch (HttpStatusCodeException e) {
                int statusCode = e.getStatusCode().value();
                String responseBody = e.getResponseBodyAsString();
                
                // Handle rate limit (403)
                if (statusCode == 403 && (responseBody != null && responseBody.contains("rate limit"))) {
                    // Only log once when rate limit is first hit
                    if (!rateLimitHit[0]) {
                        rateLimitHit[0] = true;
                        System.err.println("[ProjectsService] GitHub API rate limit exceeded. Using fallback status calculation for remaining projects.");
                    }
                    // Fallback: use hasRecentActivity as proxy
                    if (checkRecentActivity(gh)) {
                        return "in-progress";
                    }
                    return "complete";
                }
                
                // Handle empty repository (409)
                if (statusCode == 409 && (responseBody != null && responseBody.contains("empty"))) {
                    // Empty repository - no commits possible, so it's complete
                    return "complete";
                }
                
                // Other HTTP errors - log with status code
                System.err.println("[ProjectsService] Error fetching commits for " + repoName + ": " + statusCode + " " + e.getMessage());
                // Fallback: use hasRecentActivity as proxy
                if (checkRecentActivity(gh)) {
                    return "in-progress";
                }
            } catch (Exception e) {
                // Non-HTTP exceptions
                System.err.println("[ProjectsService] Error fetching commits for " + repoName + ": " + e.getMessage());
                // Fallback: use hasRecentActivity as proxy
                if (checkRecentActivity(gh)) {
                    return "in-progress";
                }
            }
            
            return "complete";
        } catch (Exception e) {
            System.err.println("[ProjectsService] Error calculating status: " + e.getMessage());
            return "complete";
        }
    }
    
    /**
     * Overlay curated data onto GitHub-derived project data
     */
    private void overlay(Map<String, Object> base, Map<String, Object> override) {
        // Status from curated data takes precedence over calculated status
        // Only override if curated data explicitly sets a status
        Object statusValue = override.get("status");
        if (statusValue != null && !String.valueOf(statusValue).trim().isEmpty()) {
            base.put("status", statusValue);
        } else {
            // If curated data doesn't have status, keep the calculated one from GitHub
            base.putIfAbsent("status", "complete");
        }
        
        for (Map.Entry<String, Object> entry : override.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            if (value == null) {
                continue;
            }
            // Do not overwrite repo URL or name if override is blank
            if (("name".equals(key) || "repo".equals(key)) && String.valueOf(value).trim().isEmpty()) {
                continue;
            }
            // Status already handled above, skip here
            if ("status".equals(key)) {
                continue;
            }
            // Do not overwrite hasRecentActivity from GitHub data with curated data
            // GitHub data is more accurate for activity tracking
            if ("hasRecentActivity".equals(key) && base.containsKey("hasRecentActivity")) {
                continue;
            }
            base.put(key, value);
        }
    }
    
    private String extractRepoNameFromUrl(String url) {
        if (url == null || url.trim().isEmpty()) return "";
        int slash = url.lastIndexOf('/');
        if (slash >= 0 && slash < url.length() - 1) {
            return url.substring(slash + 1);
        }
        return url;
    }
    
    private String normalizeRepoName(String name) {
        return name == null ? "" : name.trim().toLowerCase();
    }
    
    private String toSlug(String input) {
        if (input == null) return "";
        String slug = input.trim().toLowerCase()
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("-+", "-")
            .replaceAll("^-|-$", "");
        return slug;
    }
}

