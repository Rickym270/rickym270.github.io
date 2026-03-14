package com.rickym270.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rickym270.dto.ArticleSearchResult;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.core.env.Environment;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class SearchServiceTest {

    @Mock
    private Environment env;

    @Test
    void searchWithEmptyQueryReturnsAllArticles() {
        when(env.getProperty("OPENAI_API_KEY")).thenReturn(null);

        SearchService service = new SearchService(env, new ObjectMapper());
        List<ArticleSearchResult> results = service.search("");
        List<ArticleSearchResult> resultsNull = service.search(null);

        assertNotNull(results);
        assertNotNull(resultsNull);
        assertFalse(results.isEmpty(), "Empty query should return all articles from JSON");
        assertEquals(results.size(), resultsNull.size());

        for (ArticleSearchResult r : results) {
            assertNotNull(r.id());
            assertNotNull(r.title());
            assertNotNull(r.url());
            assertTrue(r.score() >= 0);
        }
    }

    @Test
    void searchWithKeywordReturnsMatchingArticleWithHigherScore() {
        when(env.getProperty("OPENAI_API_KEY")).thenReturn(null);

        SearchService service = new SearchService(env, new ObjectMapper());
        List<ArticleSearchResult> results = service.search("accessibility");

        assertNotNull(results);
        assertFalse(results.isEmpty());
        boolean foundAccessibility = results.stream()
            .anyMatch(r -> r.title() != null && r.title().contains("Accessibility"));
        assertTrue(foundAccessibility, "Search for 'accessibility' should return the accessibility article");
        assertTrue(results.get(0).score() >= 0);
    }

    @Test
    void searchWithKeywordReturnsResultsWithRequiredFields() {
        when(env.getProperty("OPENAI_API_KEY")).thenReturn(null);

        SearchService service = new SearchService(env, new ObjectMapper());
        List<ArticleSearchResult> results = service.search("engineering");

        assertNotNull(results);
        for (ArticleSearchResult r : results) {
            assertNotNull(r.id());
            assertNotNull(r.title());
            assertNotNull(r.description());
            assertNotNull(r.url());
            assertTrue(r.score() >= 0.0);
        }
    }
}
