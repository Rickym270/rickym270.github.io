package com.rickym270.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record AttemptCoachContext(
    String topicId,
    @NotBlank @Size(max = 200) String topicTitle,
    @NotBlank @Size(max = 2000) String referenceAnswer,
    List<@Size(max = 300) String> compareBullets,
    List<@Size(max = 300) String> pitfalls,
    boolean solutionViewedBeforeAttempt
) {}
