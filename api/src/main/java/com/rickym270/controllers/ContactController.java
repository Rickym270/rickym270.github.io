package com.rickym270.controllers;

import com.rickym270.dto.ContactMessage;
import com.rickym270.dto.ContactRequest;
import com.rickym270.exceptions.UnauthorizedException;
import com.rickym270.services.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"https://rickym270.github.io", "http://localhost:4321", "http://localhost:8080"})
@RestController
@RequestMapping("/api")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/contact")
    public ResponseEntity<ContactMessage> create(
            @Valid @RequestBody ContactRequest request,
            @RequestHeader(value = "X-Forwarded-For", required = false) String forwardedFor,
            @RequestHeader(value = "X-Real-IP", required = false) String realIp) {
        
        // Get client IP for rate limiting (check headers first, fallback to remote address)
        String clientIp = forwardedFor != null ? forwardedFor.split(",")[0].trim() 
                        : (realIp != null ? realIp : "unknown");
        
        ContactMessage saved = contactService.save(request, clientIp);
        return ResponseEntity.status(201).body(saved);
    }

    @GetMapping("/contact")
    public List<ContactMessage> list(@RequestHeader(name = "X-API-Key", required = false) String apiKey) {
        String requiredEnv = System.getenv("ADMIN_API_KEY");
        String requiredProp = System.getProperty("ADMIN_API_KEY");
        String required = requiredEnv != null && !requiredEnv.trim().isEmpty()
            ? requiredEnv.trim()
            : (requiredProp != null && !requiredProp.trim().isEmpty() ? requiredProp.trim() : null);

        String provided = apiKey == null ? null : apiKey.trim();

        if (required == null || required.isEmpty() || provided == null || !provided.equals(required)) {
            throw new UnauthorizedException("Invalid or missing API key");
        }
        return contactService.findAll();
    }
}



