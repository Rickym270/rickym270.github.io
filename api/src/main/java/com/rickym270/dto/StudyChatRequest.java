package com.rickym270.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record StudyChatRequest(
    @NotEmpty @Size(max = 20) List<@Valid StudyChatMessage> messages,
    @Valid StudyContext context
) {}
