package com.rickym270.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AttemptComparisonRow(
    @NotBlank @Size(max = 120) String area,
    @NotBlank @Size(max = 500) String myAnswer,
    @NotBlank @Size(max = 500) String modelAnswer,
    @NotBlank @Size(max = 500) String gap
) {}
