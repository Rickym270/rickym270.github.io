package com.rickym270.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * DTO for a single blog article search result.
 * Returned by GET /api/search.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ArticleSearchResult(
    String id,
    String title,
    String description,
    String url,
    double score
) {}
