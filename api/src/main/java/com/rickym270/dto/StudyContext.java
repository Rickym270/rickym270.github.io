package com.rickym270.dto;

import jakarta.validation.constraints.Size;

public record StudyContext(
    String topicId,
    String topicTitle,
    String mode,
    String currentQuestion,
    @Size(max = 8000) String contextSummary
) {}
