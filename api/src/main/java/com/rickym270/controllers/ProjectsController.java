package com.rickym270.controllers;

import com.rickym270.services.ProjectsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Controller for projects API endpoint.
 * 
 * Delegates to ProjectsService which handles:
 * - Feature flag support (FEATURE_GITHUB_PROJECT_SYNC)
 * - TTL-based caching of GitHub data
 * - Merging curated and GitHub project data
 */
@CrossOrigin(origins = {"https://rickym270.github.io", "http://localhost:4321", "http://localhost:8080"})
@RestController
@RequestMapping("/api")
public class ProjectsController {

    private final ProjectsService projectsService;

    public ProjectsController(ProjectsService projectsService) {
        this.projectsService = projectsService;
    }

    @GetMapping("/projects")
    public ResponseEntity<List<Map<String, Object>>> getProjects(
            @org.springframework.web.bind.annotation.RequestParam(name = "source", required = false) String source
    ) {
        List<Map<String, Object>> projects = projectsService.getProjects(source);
        return ResponseEntity.ok(projects);
    }
}