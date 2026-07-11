package com.rickym270.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rickym270.dto.*;
import com.rickym270.exceptions.ServiceUnavailableException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttemptCoachServiceTest {

    @Mock
    private Environment env;

    @Mock
    private RestTemplate restTemplate;

    private AttemptCoachService service;

    @BeforeEach
    void setUp() {
        service = new AttemptCoachService(env, restTemplate, new ObjectMapper());
        when(env.getProperty("OPENAI_API_KEY")).thenReturn("test-key");
    }

    @Test
    void hintActionReturnsSingleHint() {
        Map<String, Object> message = Map.of("content", "{\"hint\":\"Think about effective-date boundaries.\"}");
        Map<String, Object> choice = Map.of("message", message);
        Map<String, Object> response = Map.of("choices", List.of(choice));

        when(restTemplate.postForObject(anyString(), any(HttpEntity.class), eq(Map.class)))
            .thenReturn(response);

        AttemptCoachRequest request = new AttemptCoachRequest(
            "hint",
            "How would you regression-test a formulary update?",
            "",
            new AttemptCoachContext(
                "eligibility-rules-engine",
                "Eligibility Rules Engine",
                "Reference answer",
                List.of(),
                List.of(),
                false
            )
        );

        AttemptCoachResponse result = service.coach(request, "127.0.0.1");

        assertEquals("Think about effective-date boundaries.", result.hint());
        assertNull(result.scores());
    }

    @Test
    void evaluateActionParsesScoresAndMasteryFlags() {
        String json = """
            {
              "scores": {
                "technicalAccuracy": 8,
                "qaReasoning": 7,
                "riskAnalysis": 6,
                "completeness": 7,
                "communication": 8,
                "healthcareDomainAwareness": 7
              },
              "strengths": ["Named effective-date logic"],
              "missed": ["Commercial vs Medicare split"],
              "inaccuracies": [],
              "structureTips": "Lead with risk, then test layers.",
              "lengthFeedback": "appropriately detailed",
              "comparison": [{"area":"Risk focus","myAnswer":"...","modelAnswer":"...","gap":"critical omission"}],
              "modelAnswer": {
                "concise60to90": "Spoken answer",
                "detailedStrategy": "Detailed QA plan",
                "conceptChecklist": [{"concept":"Effective date","whyItMatters":"Wrong cohort impact"}]
              },
              "reinforcement": {
                "question": "Commercial members became ineligible — how investigate?",
                "referenceAnswer": "Check plan mapping"
              },
              "technicallyCorrect": true,
              "highRiskCovered": true,
              "masteryEligible": true
            }
            """;

        Map<String, Object> message = Map.of("content", json);
        Map<String, Object> choice = Map.of("message", message);
        Map<String, Object> response = Map.of("choices", List.of(choice));

        when(restTemplate.postForObject(anyString(), any(HttpEntity.class), eq(Map.class)))
            .thenReturn(response);

        AttemptCoachRequest request = new AttemptCoachRequest(
            "evaluate",
            "How would you regression-test a formulary update?",
            "I would test before and after effective date with Medicare and commercial plans.",
            new AttemptCoachContext(
                "eligibility-rules-engine",
                "Eligibility Rules Engine",
                "Reference answer",
                List.of("Effective date boundaries"),
                List.of("Only happy path"),
                false
            )
        );

        AttemptCoachResponse result = service.coach(request, "127.0.0.1");

        assertNotNull(result.scores());
        assertEquals(8, result.scores().technicalAccuracy());
        assertTrue(result.technicallyCorrect());
        assertTrue(result.masteryEligible());
        assertEquals("Spoken answer", result.modelAnswer().concise60to90());
        assertEquals(
            "Commercial members became ineligible — how investigate?",
            result.reinforcement().question()
        );
    }

    @Test
    void coachWithoutApiKeyThrowsServiceUnavailable() {
        when(env.getProperty("OPENAI_API_KEY")).thenReturn(null);

        AttemptCoachRequest request = new AttemptCoachRequest(
            "hint",
            "Question",
            "",
            new AttemptCoachContext("topic", "Topic", "ref", List.of(), List.of(), false)
        );

        assertThrows(
            ServiceUnavailableException.class,
            () -> service.coach(request, "127.0.0.1")
        );
    }
}
