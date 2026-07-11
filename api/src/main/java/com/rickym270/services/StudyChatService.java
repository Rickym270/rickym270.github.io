package com.rickym270.services;

import com.rickym270.dto.StudyChatMessage;
import com.rickym270.dto.StudyChatRequest;
import com.rickym270.dto.StudyChatResponse;
import com.rickym270.dto.StudyContext;
import com.rickym270.exceptions.RateLimitExceededException;
import com.rickym270.exceptions.ServiceUnavailableException;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.TimeUnit;

@Service
public class StudyChatService {

    private static final String OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
    private static final String MODEL = "gpt-4o-mini";
    private static final int MAX_TOKENS = 600;
    private static final double TEMPERATURE = 0.4;
    private static final int RATE_LIMIT_PER_HOUR = 30;

    private final Environment env;
    private final RestTemplate restTemplate;
    private final ConcurrentHashMap<String, CopyOnWriteArrayList<Long>> rateLimitMap = new ConcurrentHashMap<>();

    public StudyChatService(Environment env, RestTemplate restTemplate) {
        this.env = env;
        this.restTemplate = restTemplate;
    }

    public StudyChatResponse chat(StudyChatRequest request, String clientIp) {
        checkRateLimit(clientIp);

        String apiKey = env.getProperty("OPENAI_API_KEY");
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new ServiceUnavailableException("Study helper unavailable");
        }

        List<Map<String, String>> messages = buildOpenAiMessages(request);
        Map<String, Object> body = new HashMap<>();
        body.put("model", MODEL);
        body.put("messages", messages);
        body.put("max_tokens", MAX_TOKENS);
        body.put("temperature", TEMPERATURE);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey.trim());

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(
                OPENAI_CHAT_URL,
                new HttpEntity<>(body, headers),
                Map.class
            );
            String reply = extractReply(response);
            String model = response != null && response.get("model") != null
                ? response.get("model").toString()
                : MODEL;
            return new StudyChatResponse(reply, model);
        } catch (Exception e) {
            System.err.println("[StudyChatService] OpenAI chat failed: " + e.getMessage());
            throw new ServiceUnavailableException("Study helper unavailable");
        }
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
            throw new RateLimitExceededException("Too many study helper requests. Please try again later.");
        }

        timestamps.add(now);
        rateLimitMap.entrySet().removeIf(entry -> entry.getValue().isEmpty());
    }

    private List<Map<String, String>> buildOpenAiMessages(StudyChatRequest request) {
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", buildSystemPrompt(request.context())));

        for (StudyChatMessage message : request.messages()) {
            String role = normalizeRole(message.role());
            messages.add(Map.of("role", role, "content", message.content().trim()));
        }
        return messages;
    }

    private static String normalizeRole(String role) {
        if (role == null) {
            throw new IllegalArgumentException("Message role is required");
        }
        String normalized = role.trim().toLowerCase();
        if (!"user".equals(normalized) && !"assistant".equals(normalized)) {
            throw new IllegalArgumentException("Message role must be user or assistant");
        }
        return normalized;
    }

    static String buildSystemPrompt(StudyContext context) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an Analyst II interview coach for QA Loop Prep. ");
        sb.append("Answer concisely using the study context below. ");
        sb.append("Cite app content when relevant. Never include PHI or real member data. ");
        sb.append("Say when you are unsure.\n\n");

        if (context != null) {
            if (context.topicTitle() != null && !context.topicTitle().isBlank()) {
                sb.append("Topic: ").append(context.topicTitle().trim()).append('\n');
            }
            if (context.mode() != null && !context.mode().isBlank()) {
                sb.append("Mode: ").append(context.mode().trim()).append('\n');
            }
            if (context.currentQuestion() != null && !context.currentQuestion().isBlank()) {
                sb.append("Current question: ").append(context.currentQuestion().trim()).append('\n');
            }
            if (context.contextSummary() != null && !context.contextSummary().isBlank()) {
                sb.append('\n').append(context.contextSummary().trim());
            }
        }
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private static String extractReply(Map<String, Object> response) {
        if (response == null) {
            throw new ServiceUnavailableException("Study helper unavailable");
        }
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        if (choices == null || choices.isEmpty()) {
            throw new ServiceUnavailableException("Study helper unavailable");
        }
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        if (message == null) {
            throw new ServiceUnavailableException("Study helper unavailable");
        }
        Object content = message.get("content");
        if (content == null || content.toString().isBlank()) {
            throw new ServiceUnavailableException("Study helper unavailable");
        }
        return content.toString().trim();
    }
}
