package com.rickym270.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "https://rickym270.github.io")
@RestController
@RequestMapping("/api")
public class MetaController {

    @GetMapping("/meta")
    public Map<String, Object> getMeta() {
        Map<String, Object> response = new HashMap<>();
        response.put("name", "Ricky Martinez");
        response.put("title", "Senior SDET / Developer in Test");
        response.put("location", "New York, USA");
        response.put("languages", List.of("English", "Spanish", "German"));
        response.put("github", "https://github.com/rickym270");
        response.put("portfolio", "https://rickym270.github.io");
        return response;
    }
}