package com.rickym270.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record AttemptConceptItem(
    @NotBlank @Size(max = 200) String concept,
    @NotBlank @Size(max = 500) String whyItMatters
) {}
