package com.rickym270.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = {"https://rickym270.github.io", "http://localhost:4321", "http://localhost:8080"})
@RestController
@RequestMapping("/api")
public class ProjectsController {

    private static final String GITHUB_USER = "rickym270";

    @GetMapping("/projects")
    public ResponseEntity<List<Map<String, Object>>> getProjects(
            @org.springframework.web.bind.annotation.RequestParam(name = "source", required = false) String source
    ) {
        // Load curated projects from classpath
        List<Map<String, Object>> curatedProjects = readCuratedProjects();

        // Allow curated-only mode for debugging or when GitHub API is unavailable
        if ("curated".equalsIgnoreCase(source)) {
            return ResponseEntity.ok(curatedProjects);
        }

        // Attempt to fetch GitHub repositories; fall back to curated only on failure
        final List<Map<String, Object>> githubProjects;
        try {
            githubProjects = fetchGithubRepos();
        } catch (Exception e) {
            // Log error but don't fail - we'll return curated projects
            System.err.println("[ProjectsController] Failed to fetch GitHub repos: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(curatedProjects);
        }

        if (githubProjects == null || githubProjects.isEmpty()) {
            // Return curated list if GitHub call fails or returns nothing
            return ResponseEntity.ok(curatedProjects);
        }

        try {
            // Index curated by repo name (derived from the repo URL) for easy merging
            Map<String, Map<String, Object>> curatedByRepo = curatedProjects.stream()
                .filter(p -> p.get("repo") instanceof String)
                .collect(Collectors.toMap(
                    p -> normalizeRepoName(extractRepoNameFromUrl((String) p.get("repo"))),
                    p -> p,
                    (a, b) -> a
                ));

            // Merge: start from GitHub data and overlay curated fields when present
            List<Map<String, Object>> merged = githubProjects.stream()
                .map(gh -> {
                    try {
                        String repoName = normalizeRepoName(String.valueOf(gh.getOrDefault("name", "")));
                        Map<String, Object> base = mapGithubRepoToProject(gh);
                        Map<String, Object> override = curatedByRepo.get(repoName);
                        if (override != null) {
                            overlay(base, override);
                        }
                        return base;
                    } catch (Exception e) {
                        System.err.println("[ProjectsController] Error mapping GitHub repo: " + e.getMessage());
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
                            String status = calculateStatus(ghRepo);
                            project.put("status", status);
                        } else {
                            // No GitHub data available, assume no recent activity and complete status
                            project.put("hasRecentActivity", false);
                            project.putIfAbsent("status", "complete");
                        }
                        merged.add(project);
                    } catch (Exception e) {
                        System.err.println("[ProjectsController] Error processing curated project: " + e.getMessage());
                        e.printStackTrace();
                        // Still add the project without activity info
                        project.put("hasRecentActivity", false);
                        project.putIfAbsent("status", "complete");
                        merged.add(project);
                    }
                });

            // Optional: sort featured first, then by name
            merged.sort(Comparator
                .comparing((Map<String, Object> p) -> !(Boolean.TRUE.equals(p.get("featured"))))
                .thenComparing(p -> String.valueOf(p.getOrDefault("name", "")).toLowerCase()));

            return ResponseEntity.ok(merged);
        } catch (Exception unexpected) {
            // Defensive fallback: if anything in merge fails, return curated list only
            System.err.println("[ProjectsController] Unexpected error during merge: " + unexpected.getMessage());
            unexpected.printStackTrace();
            return ResponseEntity.ok(curatedProjects);
        }
    }

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

    private List<Map<String, Object>> fetchGithubRepos() {
        try {
            // RestTemplate with default settings
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            headers.set("X-GitHub-Api-Version", "2022-11-28");

            String token = System.getenv("GH_TOKEN");
            if (token != null && !token.trim().isEmpty()) {
                headers.set("Authorization", "Bearer " + token.trim());
            }

            HttpEntity<Void> request = new HttpEntity<>(headers);

            String url = "https://api.github.com/users/" + GITHUB_USER + "/repos?per_page=100&sort=updated";
            List<Map<String, Object>> repos = new RestTemplate()
                .exchange(url, org.springframework.http.HttpMethod.GET, request,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .getBody();

            if (repos == null) {
                return Collections.emptyList();
            }

            return repos.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        } catch (Exception ex) {
            // Catch all exceptions, not just RestClientException
            System.err.println("[ProjectsController] Error fetching GitHub repos: " + ex.getClass().getSimpleName() + ": " + ex.getMessage());
            ex.printStackTrace();
            return Collections.emptyList();
        }
    }

    private Map<String, Object> mapGithubRepoToProject(Map<String, Object> gh) {
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
        String status = calculateStatus(gh);
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
     * @return Status string: "in-progress" or "complete"
     */
    private String calculateStatus(Map<String, Object> gh) {
        try {
            String repoName = String.valueOf(gh.getOrDefault("name", ""));
            if (repoName == null || repoName.trim().isEmpty()) {
                return "complete";
            }
            
            // Calculate cutoff date (3 weeks ago)
            Instant threeWeeksAgo = Instant.now().minus(21, ChronoUnit.DAYS);
            String since = threeWeeksAgo.toString(); // ISO 8601 format
            
            // Fetch commits from GitHub API
            String token = System.getenv("GH_TOKEN");
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
            } catch (Exception e) {
                // If API call fails, fall back to pushed_at check
                System.err.println("[ProjectsController] Error fetching commits for " + repoName + ": " + e.getMessage());
                // Fallback: use hasRecentActivity as proxy
                if (checkRecentActivity(gh)) {
                    return "in-progress";
                }
            }
            
            return "complete";
        } catch (Exception e) {
            System.err.println("[ProjectsController] Error calculating status: " + e.getMessage());
            return "complete";
        }
    }

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