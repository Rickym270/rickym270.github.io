package com.rickym270.dto;

import java.time.Instant;
import java.util.UUID;

public record ContactMessage(
    UUID id,
    String name,
    String email,
    String message,
    Instant receivedAt
) {}



