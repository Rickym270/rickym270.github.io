package com.rickym270.controllers;

import com.rickym270.services.NotionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller for Notion API endpoint.
 * 
 * Provides access to Notion page content from the "Rickym270.github.io" page.
 */
@CrossOrigin(origins = {"https://rickym270.github.io", "http://localhost:4321", "http://localhost:8080"})
@RestController
@RequestMapping("/api")
public class NotionController {

    private final NotionService notionService;

    public NotionController(NotionService notionService) {
        this.notionService = notionService;
    }

    @GetMapping("/notion/pages")
    public ResponseEntity<Map<String, Object>> getPages() {
        Map<String, Object> response = new HashMap<>();
        
        if (!notionService.isAvailable()) {
            response.put("available", false);
            response.put("message", "Notion integration not configured");
            response.put("entries", Collections.emptyList());
            return ResponseEntity.ok(response);
        }

        Map<String, Object> entries = notionService.getPageEntries();
        response.put("available", true);
        response.put("entries", entries.isEmpty() ? Collections.emptyList() : entries);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/notion/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("available", notionService.isAvailable());
        response.put("configured", notionService.isAvailable());
        return ResponseEntity.ok(response);
    }
}

