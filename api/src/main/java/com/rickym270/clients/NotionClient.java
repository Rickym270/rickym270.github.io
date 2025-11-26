package com.rickym270.clients;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;

import java.util.Collections;
import java.util.Map;
import java.util.HashMap;

/**
 * Client for interacting with Notion API.
 * 
 * Uses the Notion SDK to fetch pages and content from Notion.
 * Requires NOTION_API_KEY environment variable to be set.
 */
@Component
public class NotionClient {

    private final String apiKey;
    private final Environment environment;

    public NotionClient(Environment environment) {
        this.environment = environment;
        // Get API key from environment variable
        this.apiKey = System.getenv("NOTION_API_KEY");
    }

    /**
     * Check if Notion API is configured
     * @return true if API key is available
     */
    public boolean isConfigured() {
        return apiKey != null && !apiKey.trim().isEmpty();
    }

    /**
     * Fetch pages from a Notion database/page.
     * This is a placeholder for future implementation when the Notion SDK is properly integrated.
     * 
     * @param pageName Name of the page to search for (e.g., "Rickym270.github.io")
     * @return Map containing page data or empty map if not found/configured
     */
    public Map<String, Object> fetchPage(String pageName) {
        if (!isConfigured()) {
            return Collections.emptyMap();
        }

        try {
            // TODO: Implement Notion API integration using the SDK
            // For now, return empty map as this is a "Coming Soon" feature
            return Collections.emptyMap();
        } catch (Exception e) {
            System.err.println("[NotionClient] Error fetching page '" + pageName + "': " + e.getMessage());
            return Collections.emptyMap();
        }
    }

    /**
     * Search for a page by title
     * @param pageTitle Title of the page to search for
     * @return Map containing page data or empty map if not found
     */
    public Map<String, Object> searchPageByTitle(String pageTitle) {
        if (!isConfigured()) {
            return Collections.emptyMap();
        }

        try {
            // TODO: Implement Notion API search
            // For now, return empty map as this is a "Coming Soon" feature
            return Collections.emptyMap();
        } catch (Exception e) {
            System.err.println("[NotionClient] Error searching for page '" + pageTitle + "': " + e.getMessage());
            return Collections.emptyMap();
        }
    }
}

