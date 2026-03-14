package com.rickym270.controllers;

import com.rickym270.dto.ArticleSearchResult;
import com.rickym270.services.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for blog article search API.
 * GET /api/search?q=... returns ranked articles (semantic when OPENAI_API_KEY set, else keyword).
 */
@CrossOrigin(origins = {"https://rickym270.github.io", "http://localhost:4321", "http://localhost:8080"})
@RestController
@RequestMapping("/api")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<ArticleSearchResult>> search(
            @RequestParam(name = "q", required = false, defaultValue = "") String query
    ) {
        List<ArticleSearchResult> results = searchService.search(query);
        return ResponseEntity.ok(results);
    }
}
