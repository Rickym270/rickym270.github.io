package com.rickym270.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AttemptReinforcementQuestion(
    @NotBlank @Size(max = 500) String question,
    @NotBlank @Size(max = 500) String referenceAnswer
) {}
