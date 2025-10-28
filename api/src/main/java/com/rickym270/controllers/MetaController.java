package com.rickym270.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MetaController {

    @GetMapping("/meta")
    public Map<String, Object> getMeta() {
        String isoTime = OffsetDateTime.now().toString();

        Map<String, Object> response = new HashMap<>();
        response.put("name", "Ricky Martinez");
        response.put("tagline", "SDET • Python/Java+ • CI/CD");
        response.put("location", "NYC");
        response.put("languages", Arrays.asList("EN", "ES", "DE"));
        Map<String, String> links = new HashMap<>();
        links.put("github", "https://github.com/rickym270");
        links.put("site", "https://rickym270.github.io");
        response.put("links", links);
        response.put("time", isoTime);

        return response;
    }
}