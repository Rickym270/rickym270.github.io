package com.rickym270.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rickym270.dto.*;
import com.rickym270.exceptions.RateLimitExceededException;
import com.rickym270.exceptions.ServiceUnavailableException;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class AttemptCoachService {

    private static final String OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
    private static final String MODEL = "gpt-4o-mini";
    private static final int RATE_LIMIT_PER_HOUR = 40;

    private final Environment env;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final ConcurrentHashMap<String, CopyOnWriteArrayList<Long>> rateLimitMap = new ConcurrentHashMap<>();

    public AttemptCoachService(Environment env, RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.env = env;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public AttemptCoachResponse coach(AttemptCoachRequest request, String clientIp) {
        checkRateLimit(clientIp);

        String action = request.action().trim().toLowerCase(Locale.ROOT);
        return switch (action) {
            case "hint" -> hintOnly(request);
            case "model-answer" -> modelAnswerOnly(request);
            case "evaluate" -> evaluate(request);
            default -> throw new IllegalArgumentException("action must be hint, evaluate, or model-answer");
        };
    }

    void checkRateLimit(String clientIp) {
        String key = clientIp == null || clientIp.isBlank() ? "unknown" : clientIp.trim();
        long now = System.currentTimeMillis();
        long hourAgo = now - TimeUnit.HOURS.toMillis(1);

        CopyOnWriteArrayList<Long> timestamps = rateLimitMap.computeIfAbsent(
            key,
            k -> new CopyOnWriteArrayList<>()
        );
        timestamps.removeIf(ts -> ts < hourAgo);

        if (timestamps.size() >= RATE_LIMIT_PER_HOUR) {
            throw new RateLimitExceededException("Too many attempt coach requests. Please try again later.");
        }
        timestamps.add(now);
    }

    private AttemptCoachResponse hintOnly(AttemptCoachRequest request) {
        String apiKey = requireApiKey();
        String system = buildCoachSystemPrompt();
        String user = """
            Return JSON only: {"hint":"<one short directional hint, max 25 words>"}
            Do NOT reveal the full test strategy or list every missing category.
            Question: %s
            Topic: %s
            """.formatted(
            request.question(),
            contextTitle(request)
        );

        JsonNode json = callOpenAiJson(apiKey, system, user, 120);
        String hint = textOrEmpty(json.path("hint"));
        if (hint.isBlank()) {
            hint = "Think about what should happen before, during, and after the effective date.";
        }
        return new AttemptCoachResponse(
            hint, null, null, null, null, null, null, null, null, null,
            false, false, false
        );
    }

    private AttemptCoachResponse modelAnswerOnly(AttemptCoachRequest request) {
        String apiKey = requireApiKey();
        AttemptModelAnswerPackage modelAnswer = fetchModelAnswerPackage(apiKey, request);
        return new AttemptCoachResponse(
            null, null, null, null, null, null, null, null, modelAnswer, null,
            false, false, false
        );
    }

    private AttemptCoachResponse evaluate(AttemptCoachRequest request) {
        String apiKey = requireApiKey();
        AttemptCoachContext ctx = request.context();
        boolean solutionViewed = ctx != null && ctx.solutionViewedBeforeAttempt();
        String userAnswer = request.userAnswer() == null ? "" : request.userAnswer().trim();

        String system = buildCoachSystemPrompt();
        String user = buildEvaluatePrompt(request, userAnswer, solutionViewed);

        JsonNode json = callOpenAiJson(apiKey, system, user, 1800);
        AttemptCoachResponse parsed = parseEvaluateResponse(json, request);

        if (parsed.modelAnswer() == null) {
            AttemptModelAnswerPackage modelAnswer = fetchModelAnswerPackage(apiKey, request);
            return new AttemptCoachResponse(
                parsed.hint(),
                parsed.scores(),
                parsed.strengths(),
                parsed.missed(),
                parsed.inaccuracies(),
                parsed.structureTips(),
                parsed.lengthFeedback(),
                parsed.comparison(),
                modelAnswer,
                parsed.reinforcement(),
                parsed.technicallyCorrect(),
                parsed.highRiskCovered(),
                parsed.masteryEligible()
            );
        }
        return parsed;
    }

    private String buildEvaluatePrompt(
        AttemptCoachRequest request,
        String userAnswer,
        boolean solutionViewed
    ) {
        AttemptCoachContext ctx = request.context();
        String bullets = ctx != null && ctx.compareBullets() != null
            ? String.join("; ", ctx.compareBullets())
            : "";
        String pitfalls = ctx != null && ctx.pitfalls() != null
            ? String.join("; ", ctx.pitfalls())
            : "";
        String reference = ctx != null ? ctx.referenceAnswer() : "";

        return """
            Evaluate the candidate answer for a Judi Health Technical QA Analyst II interview.
            Return JSON only with this schema:
            {
              "scores": {
                "technicalAccuracy": 1-10,
                "qaReasoning": 1-10,
                "riskAnalysis": 1-10,
                "completeness": 1-10,
                "communication": 1-10,
                "healthcareDomainAwareness": 1-10
              },
              "strengths": ["..."],
              "missed": ["..."],
              "inaccuracies": ["..."],
              "structureTips": "how to make answer more structured and conversational",
              "lengthFeedback": "too short | too long | appropriately detailed — with brief reason",
              "comparison": [{"area":"...","myAnswer":"...","modelAnswer":"...","gap":"critical omission | useful addition | optional detail | different wording (still correct)"}],
              "modelAnswer": {
                "concise60to90": "spoken answer ~60-90 seconds, natural not robotic",
                "detailedStrategy": "full QA strategy",
                "conceptChecklist": [{"concept":"...","whyItMatters":"..."}]
              },
              "reinforcement": {
                "question": "similar but slightly changed scenario question",
                "referenceAnswer": "hidden model answer for reinforcement"
              },
              "technicallyCorrect": true/false,
              "highRiskCovered": true/false,
              "masteryEligible": true/false
            }

            Rules:
            - Do not require same wording as reference answer.
            - Distinguish critical omissions vs stylistic differences.
            - masteryEligible is true only when technicallyCorrect and highRiskCovered and solution was NOT viewed before attempt.
            - Emphasize healthcare QA: eligibility, formulary, effective dates, HIPAA, SQL/API/UI validation, regression.
            - comparison should include only meaningful differences (max 6 rows).
            - reinforcement question must change the scenario slightly.

            Question: %s
            Topic: %s
            Reference answer: %s
            Strong answer bullets: %s
            Pitfalls: %s
            Solution viewed before attempt: %s
            Candidate answer: %s
            """.formatted(
            request.question(),
            contextTitle(request),
            reference,
            bullets,
            pitfalls,
            solutionViewed,
            userAnswer.isBlank() ? "(no answer submitted — user skipped to solution)" : userAnswer
        );
    }

    private AttemptModelAnswerPackage fetchModelAnswerPackage(String apiKey, AttemptCoachRequest request) {
        String system = buildCoachSystemPrompt();
        String user = """
            Return JSON only:
            {
              "modelAnswer": {
                "concise60to90": "...",
                "detailedStrategy": "...",
                "conceptChecklist": [{"concept":"...","whyItMatters":"..."}]
              }
            }
            Question: %s
            Topic: %s
            Reference answer: %s
            """.formatted(
            request.question(),
            contextTitle(request),
            request.context() != null ? request.context().referenceAnswer() : ""
        );

        JsonNode json = callOpenAiJson(apiKey, system, user, 1400);
        return parseModelAnswer(json.path("modelAnswer"));
    }

    private AttemptCoachResponse parseEvaluateResponse(JsonNode json, AttemptCoachRequest request) {
        AttemptScoreBlock scores = parseScores(json.path("scores"));
        List<String> strengths = parseStringList(json.path("strengths"));
        List<String> missed = parseStringList(json.path("missed"));
        List<String> inaccuracies = parseStringList(json.path("inaccuracies"));
        String structureTips = textOrEmpty(json.path("structureTips"));
        String lengthFeedback = textOrEmpty(json.path("lengthFeedback"));
        List<AttemptComparisonRow> comparison = parseComparison(json.path("comparison"));
        AttemptModelAnswerPackage modelAnswer = json.has("modelAnswer")
            ? parseModelAnswer(json.path("modelAnswer"))
            : null;
        AttemptReinforcementQuestion reinforcement = parseReinforcement(json.path("reinforcement"));

        boolean technicallyCorrect = json.path("technicallyCorrect").asBoolean(false);
        boolean highRiskCovered = json.path("highRiskCovered").asBoolean(false);
        boolean solutionViewed = request.context() != null && request.context().solutionViewedBeforeAttempt();
        boolean masteryEligible = json.path("masteryEligible").asBoolean(false) && !solutionViewed;

        return new AttemptCoachResponse(
            null,
            scores,
            strengths,
            missed,
            inaccuracies,
            structureTips,
            lengthFeedback,
            comparison,
            modelAnswer,
            reinforcement,
            technicallyCorrect,
            highRiskCovered,
            masteryEligible
        );
    }

    private AttemptScoreBlock parseScores(JsonNode node) {
        if (node == null || node.isMissingNode()) {
            return new AttemptScoreBlock(5, 5, 5, 5, 5, 5);
        }
        return new AttemptScoreBlock(
            clampScore(node.path("technicalAccuracy").asInt(5)),
            clampScore(node.path("qaReasoning").asInt(5)),
            clampScore(node.path("riskAnalysis").asInt(5)),
            clampScore(node.path("completeness").asInt(5)),
            clampScore(node.path("communication").asInt(5)),
            clampScore(node.path("healthcareDomainAwareness").asInt(5))
        );
    }

    private AttemptModelAnswerPackage parseModelAnswer(JsonNode node) {
        if (node == null || node.isMissingNode()) {
            String ref = "";
            return new AttemptModelAnswerPackage(ref, ref, List.of());
        }
        List<AttemptConceptItem> checklist = new ArrayList<>();
        for (JsonNode item : node.path("conceptChecklist")) {
            String concept = textOrEmpty(item.path("concept"));
            String why = textOrEmpty(item.path("whyItMatters"));
            if (!concept.isBlank()) {
                checklist.add(new AttemptConceptItem(concept, why.isBlank() ? "Core interview expectation." : why));
            }
        }
        String concise = textOrEmpty(node.path("concise60to90"));
        String detailed = textOrEmpty(node.path("detailedStrategy"));
        if (concise.isBlank() && detailed.isBlank()) {
            concise = "See detailed strategy for a complete spoken answer.";
        }
        return new AttemptModelAnswerPackage(concise, detailed, checklist);
    }

    private AttemptReinforcementQuestion parseReinforcement(JsonNode node) {
        if (node == null || node.isMissingNode()) {
            return null;
        }
        String question = textOrEmpty(node.path("question"));
        String referenceAnswer = textOrEmpty(node.path("referenceAnswer"));
        if (question.isBlank()) {
            return null;
        }
        return new AttemptReinforcementQuestion(question, referenceAnswer);
    }

    private List<AttemptComparisonRow> parseComparison(JsonNode node) {
        if (node == null || !node.isArray()) {
            return List.of();
        }
        List<AttemptComparisonRow> rows = new ArrayList<>();
        for (JsonNode row : node) {
            String area = textOrEmpty(row.path("area"));
            if (area.isBlank()) continue;
            rows.add(new AttemptComparisonRow(
                area,
                textOrEmpty(row.path("myAnswer")),
                textOrEmpty(row.path("modelAnswer")),
                textOrEmpty(row.path("gap"))
            ));
        }
        return rows;
    }

    private List<String> parseStringList(JsonNode node) {
        if (node == null || !node.isArray()) {
            return List.of();
        }
        List<String> items = new ArrayList<>();
        for (JsonNode child : node) {
            String value = textOrEmpty(child);
            if (!value.isBlank()) {
                items.add(value);
            }
        }
        return items;
    }

    private int clampScore(int value) {
        return Math.max(1, Math.min(10, value));
    }

    private String textOrEmpty(JsonNode node) {
        if (node == null || node.isMissingNode() || node.isNull()) {
            return "";
        }
        return node.asText("").trim();
    }

    private String contextTitle(AttemptCoachRequest request) {
        if (request.context() == null || request.context().topicTitle() == null) {
            return "QA interview prep";
        }
        return request.context().topicTitle();
    }

    private String buildCoachSystemPrompt() {
        return """
            You are a Judi Health Technical QA Analyst II interview coach.
            Evaluate reasoning and coverage, not exact wording.
            Never include real PHI. Keep feedback practical and conversational.
            Always respond with valid JSON matching the requested schema.
            """;
    }

    private String requireApiKey() {
        String apiKey = env.getProperty("OPENAI_API_KEY");
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new ServiceUnavailableException("Attempt coach unavailable");
        }
        return apiKey.trim();
    }

    private JsonNode callOpenAiJson(String apiKey, String system, String user, int maxTokens) {
        Map<String, Object> body = new HashMap<>();
        body.put("model", MODEL);
        body.put("max_tokens", maxTokens);
        body.put("temperature", 0.35);
        body.put("response_format", Map.of("type", "json_object"));
        body.put("messages", List.of(
            Map.of("role", "system", "content", system),
            Map.of("role", "user", "content", user)
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(
                OPENAI_CHAT_URL,
                new HttpEntity<>(body, headers),
                Map.class
            );
            String content = extractMessageContent(response);
            return objectMapper.readTree(content);
        } catch (Exception e) {
            System.err.println("[AttemptCoachService] OpenAI call failed: " + e.getMessage());
            throw new ServiceUnavailableException("Attempt coach unavailable");
        }
    }

    @SuppressWarnings("unchecked")
    private static String extractMessageContent(Map<String, Object> response) {
        if (response == null) {
            throw new ServiceUnavailableException("Attempt coach unavailable");
        }
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        if (choices == null || choices.isEmpty()) {
            throw new ServiceUnavailableException("Attempt coach unavailable");
        }
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        if (message == null || message.get("content") == null) {
            throw new ServiceUnavailableException("Attempt coach unavailable");
        }
        return message.get("content").toString();
    }
}
