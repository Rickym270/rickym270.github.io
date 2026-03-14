package com.rickym270.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rickym270.dto.ArticleSearchResult;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Service for blog article search with optional semantic (embedding) ranking.
 * When OPENAI_API_KEY is set, uses OpenAI embeddings and cosine similarity.
 * Otherwise uses keyword overlap scoring so CI and local runs work without a key.
 */
@Service
public class SearchService {

    private static final String ARTICLES_RESOURCE = "data/articles.json";
    private static final String OPENAI_EMBEDDINGS_URL = "https://api.openai.com/v1/embeddings";
    private static final String EMBEDDING_MODEL = "text-embedding-3-small";
    private static final Pattern WORD_PATTERN = Pattern.compile("[^a-z0-9]+");
    private static final int MAX_RESULTS = 20;

    private final Environment env;
    private final ObjectMapper objectMapper;

    private volatile List<Map<String, Object>> articlesCache;
    private final Map<String, float[]> embeddingCache = new ConcurrentHashMap<>();

    public SearchService(Environment env, ObjectMapper objectMapper) {
        this.env = env;
        this.objectMapper = objectMapper;
    }

    /**
     * Search articles by query. Empty query returns all articles in deterministic order.
     */
    public List<ArticleSearchResult> search(String query) {
        List<Map<String, Object>> articles = loadArticles();
        if (articles.isEmpty()) {
            return Collections.emptyList();
        }

        String q = query != null ? query.trim() : "";
        if (q.isEmpty()) {
            return articles.stream()
                .map(a -> toResult(a, 1.0))
                .limit(MAX_RESULTS)
                .collect(Collectors.toList());
        }

        String apiKey = env.getProperty("OPENAI_API_KEY");
        if (apiKey != null && !apiKey.trim().isEmpty()) {
            return searchWithEmbeddings(articles, q, apiKey.trim());
        }
        return searchWithKeywords(articles, q);
    }

    private List<ArticleSearchResult> searchWithKeywords(List<Map<String, Object>> articles, String query) {
        Set<String> queryWords = toWords(query);
        if (queryWords.isEmpty()) {
            return articles.stream()
                .map(a -> toResult(a, 1.0))
                .limit(MAX_RESULTS)
                .collect(Collectors.toList());
        }

        List<ArticleSearchResult> scored = new ArrayList<>();
        for (Map<String, Object> a : articles) {
            String title = stringOrEmpty(a.get("title"));
            String description = stringOrEmpty(a.get("description"));
            double score = keywordScore(queryWords, title, description);
            scored.add(toResult(a, score));
        }
        scored.sort((a, b) -> Double.compare(b.score(), a.score()));
        return scored.stream().limit(MAX_RESULTS).collect(Collectors.toList());
    }

    private double keywordScore(Set<String> queryWords, String title, String description) {
        Set<String> titleWords = toWords(title);
        Set<String> descWords = toWords(description);
        int titleMatches = (int) queryWords.stream().filter(titleWords::contains).count();
        int descMatches = (int) queryWords.stream().filter(descWords::contains).count();
        return titleMatches * 2.0 + descMatches;
    }

    private static Set<String> toWords(String text) {
        if (text == null || text.isEmpty()) return Set.of();
        String normalized = text.toLowerCase().trim();
        return Arrays.stream(WORD_PATTERN.split(normalized))
            .filter(s -> !s.isEmpty())
            .collect(Collectors.toSet());
    }

    private List<ArticleSearchResult> searchWithEmbeddings(List<Map<String, Object>> articles, String query, String apiKey) {
        try {
            float[] queryEmbedding = fetchEmbedding(query, apiKey);
            if (queryEmbedding == null) {
                return searchWithKeywords(articles, query);
            }

            List<ArticleSearchResult> scored = new ArrayList<>();
            for (Map<String, Object> a : articles) {
                String id = stringOrEmpty(a.get("id"));
                float[] articleEmbedding = getOrFetchArticleEmbedding(id, a, apiKey);
                if (articleEmbedding != null) {
                    double sim = cosineSimilarity(queryEmbedding, articleEmbedding);
                    scored.add(toResult(a, sim));
                } else {
                    scored.add(toResult(a, 0.0));
                }
            }
            scored.sort((x, y) -> Double.compare(y.score(), x.score()));
            return scored.stream().limit(MAX_RESULTS).collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("[SearchService] Embedding search failed, falling back to keyword: " + e.getMessage());
            return searchWithKeywords(articles, query);
        }
    }

    private float[] getOrFetchArticleEmbedding(String id, Map<String, Object> article, String apiKey) {
        return embeddingCache.computeIfAbsent(id, k -> {
            String text = stringOrEmpty(article.get("title")) + " " + stringOrEmpty(article.get("description"));
            return fetchEmbedding(text, apiKey);
        });
    }

    @SuppressWarnings("unchecked")
    private float[] fetchEmbedding(String text, String apiKey) {
        if (text == null || text.trim().isEmpty()) return null;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("model", EMBEDDING_MODEL);
        body.put("input", text.trim());

        try {
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            Map<String, Object> response = new RestTemplate().postForObject(OPENAI_EMBEDDINGS_URL, request, Map.class);
            if (response == null) return null;
            List<Map<String, Object>> data = (List<Map<String, Object>>) response.get("data");
            if (data == null || data.isEmpty()) return null;
            List<Number> embedding = (List<Number>) data.get(0).get("embedding");
            if (embedding == null) return null;
            float[] vec = new float[embedding.size()];
            for (int i = 0; i < embedding.size(); i++) {
                vec[i] = embedding.get(i).floatValue();
            }
            return vec;
        } catch (Exception e) {
            System.err.println("[SearchService] OpenAI embedding failed: " + e.getMessage());
            return null;
        }
    }

    private static double cosineSimilarity(float[] a, float[] b) {
        if (a == null || b == null || a.length != b.length) return 0;
        double dot = 0, normA = 0, normB = 0;
        for (int i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        if (normA == 0 || normB == 0) return 0;
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    private List<Map<String, Object>> loadArticles() {
        if (articlesCache != null) return articlesCache;
        synchronized (this) {
            if (articlesCache != null) return articlesCache;
            ClassPathResource resource = new ClassPathResource(ARTICLES_RESOURCE);
            try (InputStream is = resource.getInputStream()) {
                articlesCache = objectMapper.readValue(is, new TypeReference<List<Map<String, Object>>>() {});
                return articlesCache;
            } catch (IOException e) {
                System.err.println("[SearchService] Failed to load articles: " + e.getMessage());
                articlesCache = Collections.emptyList();
                return articlesCache;
            }
        }
    }

    private static ArticleSearchResult toResult(Map<String, Object> a, double score) {
        return new ArticleSearchResult(
            stringOrEmpty(a.get("id")),
            stringOrEmpty(a.get("title")),
            stringOrEmpty(a.get("description")),
            stringOrEmpty(a.get("url")),
            score
        );
    }

    private static String stringOrEmpty(Object o) {
        return o == null ? "" : o.toString().trim();
    }
}
