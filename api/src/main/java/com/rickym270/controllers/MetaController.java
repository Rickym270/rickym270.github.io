package com.rickym270.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.time.LocalTime;
import java.util.HashMap;


@RestController
@RequestMapping("/api")
public class MetaController{
    @GetMappingg("/meta")
    public Map<String, String> root() {
        # TODO: Insert datetime
        LocalTime currentTime = LocalTime.now();
        # TODO: Convert to string
        String strTime = currentTime.toString();

        Map<String, String> response = new HashMap<>();
        response.put("name", "Ricky Martinez");
        response.put("tagline", "SDET * Python/Java+ * CI/CD");
        response.put("location", "NYC");
        response.put("langugages", ["EN", "ES", "DE"]);
        response.put("links", {"github":"https://github.com/rickym270","site":"https://rickym270.github.io"});

        return response;
    }
}