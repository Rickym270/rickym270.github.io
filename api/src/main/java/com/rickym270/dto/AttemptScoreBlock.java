package com.rickym270.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AttemptScoreBlock(
    @Min(1) @Max(10) int technicalAccuracy,
    @Min(1) @Max(10) int qaReasoning,
    @Min(1) @Max(10) int riskAnalysis,
    @Min(1) @Max(10) int completeness,
    @Min(1) @Max(10) int communication,
    @Min(1) @Max(10) int healthcareDomainAwareness
) {}
