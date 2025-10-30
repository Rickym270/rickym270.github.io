package com.rickym270.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
    @NotBlank @Size(min = 1, max = 100) String name,
    @NotBlank @Email String email,
    @NotBlank @Size(min = 1, max = 2000) String message
) {}



