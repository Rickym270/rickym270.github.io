package com.rickym270.controllers;

import com.rickym270.dto.ContactMessage;
import com.rickym270.dto.ContactRequest;
import com.rickym270.exceptions.UnauthorizedException;
import com.rickym270.services.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "https://rickym270.github.io")
@RestController
@RequestMapping("/api")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/contact")
    public ResponseEntity<ContactMessage> create(@Valid @RequestBody ContactRequest request) {
        ContactMessage saved = contactService.save(request);
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



