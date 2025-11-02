package com.rickym270.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "https://rickym270.github.io")
@RestController
@RequestMapping("/api")
public class HomeController {
    @GetMapping("/home")
    public String home() {
        return "Home";
    }
}