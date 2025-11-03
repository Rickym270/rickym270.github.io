package com.rickym270.controllers;

import com.rickym270.services.ProjectsStatsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = {"https://rickym270.github.io", "http://localhost:4321", "http://localhost:8080"})
@RestController
@RequestMapping("/api")
public class StatsController {

    private final ProjectsStatsService statsService;

    public StatsController(ProjectsStatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> body = new HashMap<>();
        body.put("projects", statsService.getCuratedProjectsCount());
        body.put("languages", statsService.getUniqueLanguages());
        body.put("lastUpdated", Instant.now().toString());
        return body;
    }
}



