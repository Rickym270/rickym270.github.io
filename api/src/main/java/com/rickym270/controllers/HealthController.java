package com.rickym270.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping({"", "/health"})
    public Map<String, String> root() {
        LocalTime currentTime = LocalTime.now();
        String datetime = currentTime.toString();
        String javaVersion = System.getProperty("java.version");

        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("java", javaVersion);
        response.put("time", datetime);

        return response;
    }
}