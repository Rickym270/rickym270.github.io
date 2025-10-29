package com.rickym270.controllers;

import com.rickym270.clients.GitHubClient;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "https://rickym270.github.io")
@RestController
@RequestMapping("/api")
public class GithubActivityController {

    private final GitHubClient gitHubClient;

    public GithubActivityController(GitHubClient gitHubClient) {
        this.gitHubClient = gitHubClient;
    }

    @GetMapping("/github/activity")
    public List<Map<String, Object>> recentActivity() {
        return gitHubClient.fetchRecentActivity();
    }
}



