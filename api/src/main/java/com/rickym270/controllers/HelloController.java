package com.rickym270.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "Hello";
    }

    @GetMapping({"", "/"})
    public String root() {
        return "API OK";
    }

    @GetMapping("/projects")
    public String projects() {
        return "Projects";
    }
}