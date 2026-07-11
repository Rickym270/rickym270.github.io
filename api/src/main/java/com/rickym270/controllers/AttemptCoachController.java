package com.rickym270.controllers;

import com.rickym270.dto.AttemptCoachRequest;
import com.rickym270.dto.AttemptCoachResponse;
import com.rickym270.services.AttemptCoachService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"https://rickym270.github.io", "http://localhost:4321", "http://localhost:8080"})
@RestController
@RequestMapping("/api")
public class AttemptCoachController {

    private final AttemptCoachService attemptCoachService;

    public AttemptCoachController(AttemptCoachService attemptCoachService) {
        this.attemptCoachService = attemptCoachService;
    }

    @PostMapping("/qa-prep/attempt-coach")
    public ResponseEntity<AttemptCoachResponse> coach(
            @Valid @RequestBody AttemptCoachRequest request,
            @RequestHeader(value = "X-Forwarded-For", required = false) String forwardedFor,
            @RequestHeader(value = "X-Real-IP", required = false) String realIp) {

        String clientIp = StudyChatController.resolveClientIp(forwardedFor, realIp);
        AttemptCoachResponse response = attemptCoachService.coach(request, clientIp);
        return ResponseEntity.ok(response);
    }
}
