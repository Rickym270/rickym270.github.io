package com.rickym270.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "https://rickym270.github.io")
@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping({"", "/health"})
    public Map<String, Object> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("version", "1.0.0");
        response.put("time", Instant.now().toString());
        return response;
    }
}