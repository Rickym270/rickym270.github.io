package com.rickym270.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StudyChatMessage(
    @NotBlank @Size(max = 32) String role,
    @NotBlank @Size(max = 4000) String content
) {}
