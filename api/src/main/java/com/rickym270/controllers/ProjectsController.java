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
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = "https://rickym270.github.io")
@RestController
@RequestMapping("/api")
public class ProjectsController {

    private static final String GITHUB_USER = "rickym270";

    @GetMapping("/projects")
    public ResponseEntity<List<Map<String, Object>>> getProjects() {
        // Load curated projects from classpath
        List<Map<String, Object>> curatedProjects = readCuratedProjects();

        // Attempt to fetch GitHub repositories; fall back to curated only on failure
        List<Map<String, Object>> githubProjects = fetchGithubRepos();

        if (githubProjects.isEmpty()) {
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
                    String repoName = normalizeRepoName(String.valueOf(gh.getOrDefault("name", "")));
                    Map<String, Object> base = mapGithubRepoToProject(gh);
                    Map<String, Object> override = curatedByRepo.get(repoName);
                    if (override != null) {
                        overlay(base, override);
                    }
                    return base;
                })
                .collect(Collectors.toList());

            // Add any curated projects that do not exist on GitHub (external or archived)
            Set<String> mergedNames = merged.stream()
                .map(p -> normalizeRepoName(String.valueOf(p.getOrDefault("name", ""))))
                .collect(Collectors.toSet());

            curatedProjects.stream()
                .filter(p -> p.get("repo") instanceof String)
                .filter(p -> !mergedNames.contains(normalizeRepoName(extractRepoNameFromUrl((String) p.get("repo")))))
                .forEach(merged::add);

            // Optional: sort featured first, then by name
            merged.sort(Comparator
                .comparing((Map<String, Object> p) -> !(Boolean.TRUE.equals(p.get("featured"))))
                .thenComparing(p -> String.valueOf(p.getOrDefault("name", "")).toLowerCase()));

            return ResponseEntity.ok(merged);
        } catch (Exception unexpected) {
            // Defensive fallback: if anything in merge fails, return curated list only
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

            String token = System.getenv("GITHUB_TOKEN");
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
        } catch (RestClientException ex) {
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
        return project;
    }

    private void overlay(Map<String, Object> base, Map<String, Object> override) {
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