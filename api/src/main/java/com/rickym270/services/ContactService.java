package com.rickym270.services;

import com.rickym270.dto.ContactMessage;
import com.rickym270.dto.ContactRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class ContactService {

    private final List<ContactMessage> messages = Collections.synchronizedList(new ArrayList<>());
    private final TurnstileService turnstileService;
    private final EmailService emailService;
    // Rate limiting: track IP addresses and their last submission time
    private final ConcurrentHashMap<String, Long> rateLimitMap = new ConcurrentHashMap<>();
    private static final long RATE_LIMIT_MINUTES = 5; // Allow one submission per 5 minutes per IP

    public ContactService(TurnstileService turnstileService, EmailService emailService) {
        this.turnstileService = turnstileService;
        this.emailService = emailService;
    }

    public ContactMessage save(ContactRequest dto, String clientIp) {
        // Check honeypot field - if filled, it's spam
        if (dto.honeypot() != null && !dto.honeypot().trim().isEmpty()) {
            throw new IllegalArgumentException("Spam detected");
        }

        // Verify Turnstile token (only if token is provided or secret key is configured)
        String turnstileToken = dto.turnstileToken();
        if (turnstileToken != null && !turnstileToken.trim().isEmpty()) {
            // Token provided, verify it
            if (!turnstileService.verifyToken(turnstileToken, clientIp)) {
                throw new IllegalArgumentException("CAPTCHA verification failed");
            }
        }
        // If no token provided and Turnstile isn't configured, allow submission (for development)

        // Rate limiting check
        long now = System.currentTimeMillis();
        Long lastSubmission = rateLimitMap.get(clientIp);
        if (lastSubmission != null) {
            long timeSinceLastSubmission = TimeUnit.MILLISECONDS.toMinutes(now - lastSubmission);
            if (timeSinceLastSubmission < RATE_LIMIT_MINUTES) {
                throw new IllegalArgumentException("Please wait before submitting another message");
            }
        }

        // Update rate limit
        rateLimitMap.put(clientIp, now);
        // Clean up old entries (older than 1 hour)
        rateLimitMap.entrySet().removeIf(entry -> 
            TimeUnit.MILLISECONDS.toMinutes(now - entry.getValue()) > 60);

        ContactMessage message = new ContactMessage(
            UUID.randomUUID(),
            dto.name(),
            dto.email(),
            dto.subject(),
            dto.message(),
            Instant.now()
        );
        messages.add(message);
        
        // Send email notification (non-blocking, failures don't prevent message storage)
        try {
            emailService.sendContactEmail(
                dto.email(),
                dto.email(),
                dto.name(),
                dto.subject(),
                dto.message()
            );
        } catch (Exception e) {
            System.err.println("[ContactService] Failed to send email notification: " + e.getMessage());
            // Don't fail the request if email fails - message is still stored
        }
        
        return message;
    }

    public List<ContactMessage> findAll() {
        synchronized (messages) {
            return new ArrayList<>(messages);
        }
    }
}



