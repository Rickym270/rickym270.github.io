package com.rickym270.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record AttemptCoachResponse(
    String hint,
    AttemptScoreBlock scores,
    List<@Size(max = 400) String> strengths,
    List<@Size(max = 400) String> missed,
    List<@Size(max = 400) String> inaccuracies,
    @Size(max = 1000) String structureTips,
    @Size(max = 300) String lengthFeedback,
    List<AttemptComparisonRow> comparison,
    AttemptModelAnswerPackage modelAnswer,
    AttemptReinforcementQuestion reinforcement,
    boolean technicallyCorrect,
    boolean highRiskCovered,
    boolean masteryEligible
) {}
