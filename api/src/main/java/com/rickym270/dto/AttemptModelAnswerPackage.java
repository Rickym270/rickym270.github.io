package com.rickym270.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record AttemptModelAnswerPackage(
    @NotBlank @Size(max = 2500) String concise60to90,
    @NotBlank @Size(max = 4000) String detailedStrategy,
    List<AttemptConceptItem> conceptChecklist
) {}
