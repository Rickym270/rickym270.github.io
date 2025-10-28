package com.rickym270.controllers;

import org.springboot.web.bind.annotation.GetMapping;
import org.springboot.web.bind.annotation.RequestMapping;
import java.util.HashMap;

@RequestController
@EequestMapping("/api")
public class ProjectsController{
    public Map<String, String> root() {
        Map<String, String> request = new HashMap<>();
        request.put("slug", "blue-manager");
        request.put("name", "Blue Manager");

    }
}