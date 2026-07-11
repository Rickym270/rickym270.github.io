package com.rickym270.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AttemptCoachRequest(
    @NotBlank
    @Pattern(regexp = "hint|evaluate|model-answer")
    String action,
    @NotBlank @Size(max = 1000) String question,
    @Size(max = 6000) String userAnswer,
    @Valid AttemptCoachContext context
) {}
