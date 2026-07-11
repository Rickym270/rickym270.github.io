package com.rickym270.services;

import com.rickym270.dto.StudyChatMessage;
import com.rickym270.dto.StudyChatRequest;
import com.rickym270.dto.StudyChatResponse;
import com.rickym270.dto.StudyContext;
import com.rickym270.exceptions.ServiceUnavailableException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
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
@MockitoSettings(strictness = Strictness.LENIENT)
class StudyChatServiceTest {

    @Mock
    private Environment env;

    @Mock
    private RestTemplate restTemplate;

    private StudyChatService service;

    @BeforeEach
    void setUp() {
        service = new StudyChatService(env, restTemplate);
        when(env.getProperty("OPENAI_API_KEY")).thenReturn("test-key");
    }

    @Test
    void chatReturnsAssistantReplyFromOpenAi() {
        Map<String, Object> message = new HashMap<>();
        message.put("content", "Layer contract tests first, then integration.");

        Map<String, Object> choice = new HashMap<>();
        choice.put("message", message);

        Map<String, Object> response = new HashMap<>();
        response.put("choices", List.of(choice));
        response.put("model", "gpt-4o-mini");

        when(restTemplate.postForObject(anyString(), any(HttpEntity.class), eq(Map.class)))
            .thenReturn(response);

        StudyChatRequest request = new StudyChatRequest(
            List.of(new StudyChatMessage("user", "How do I answer the eligibility question?")),
            new StudyContext(
                "eligibility-rules-engine",
                "Eligibility Rules Engine",
                "study",
                null,
                "Topic summary"
            )
        );

        StudyChatResponse result = service.chat(request, "127.0.0.1");

        assertEquals("Layer contract tests first, then integration.", result.reply());
        assertEquals("gpt-4o-mini", result.model());

        ArgumentCaptor<HttpEntity> captor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).postForObject(anyString(), captor.capture(), eq(Map.class));

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) captor.getValue().getBody();
        assertNotNull(body);
        assertEquals("gpt-4o-mini", body.get("model"));
    }

    @Test
    void chatWithoutApiKeyThrowsServiceUnavailable() {
        when(env.getProperty("OPENAI_API_KEY")).thenReturn(null);

        StudyChatRequest request = new StudyChatRequest(
            List.of(new StudyChatMessage("user", "Hello")),
            null
        );

        ServiceUnavailableException ex = assertThrows(
            ServiceUnavailableException.class,
            () -> service.chat(request, "127.0.0.1")
        );
        assertEquals("Study helper unavailable", ex.getMessage());
        verifyNoInteractions(restTemplate);
    }

    @Test
    void buildSystemPromptIncludesContextSummary() {
        String prompt = StudyChatService.buildSystemPrompt(
            new StudyContext(
                "backend-api-testing",
                "Backend API Testing",
                "practice",
                "How would you test eligibility?",
                "Strong bullets and pitfalls"
            )
        );

        assertTrue(prompt.contains("Backend API Testing"));
        assertTrue(prompt.contains("practice"));
        assertTrue(prompt.contains("How would you test eligibility?"));
        assertTrue(prompt.contains("Strong bullets and pitfalls"));
        assertTrue(prompt.contains("Analyst II interview coach"));
    }
}
