package com.rickym270.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalTime;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping({"", "/health"})
    public String root() {
        String datetime = LocalTime currentTime = LocalTime.now();
        String javaVersion = System.getProperty("java.version");


        return {
                "status":"UP",
                "java": javaVersion,
                "time": datetime
        }

        };
    }
}