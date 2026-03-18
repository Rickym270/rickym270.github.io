package com.rickym270.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * Response payload for POST /api/contact so the UI can distinguish:
 * - message stored successfully
 * - email notification delivered successfully
 */
public record ContactResponse(
        UUID id,
        String name,
        String email,
        String subject,
        String message,
        Instant receivedAt,
        boolean emailNotificationSent
) {}

