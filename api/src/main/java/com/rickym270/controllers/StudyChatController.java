package com.rickym270.controllers;

import com.rickym270.dto.StudyChatRequest;
import com.rickym270.dto.StudyChatResponse;
import com.rickym270.services.StudyChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"https://rickym270.github.io", "http://localhost:4321", "http://localhost:8080"})
@RestController
@RequestMapping("/api")
public class StudyChatController {

    private final StudyChatService studyChatService;

    public StudyChatController(StudyChatService studyChatService) {
        this.studyChatService = studyChatService;
    }

    @PostMapping("/qa-prep/study-chat")
    public ResponseEntity<StudyChatResponse> chat(
            @Valid @RequestBody StudyChatRequest request,
            @RequestHeader(value = "X-Forwarded-For", required = false) String forwardedFor,
            @RequestHeader(value = "X-Real-IP", required = false) String realIp) {

        String clientIp = resolveClientIp(forwardedFor, realIp);
        StudyChatResponse response = studyChatService.chat(request, clientIp);
        return ResponseEntity.ok(response);
    }

    static String resolveClientIp(String forwardedFor, String realIp) {
        if (forwardedFor != null && !forwardedFor.trim().isEmpty()) {
            String[] ips = forwardedFor.split(",");
            return ips[0].trim();
        }
        if (realIp != null && !realIp.trim().isEmpty()) {
            return realIp.trim();
        }
        return "unknown";
    }
}
