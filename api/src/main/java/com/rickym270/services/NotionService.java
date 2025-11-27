package com.rickym270.services;

import com.rickym270.clients.NotionClient;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

/**
 * Service for managing Notion content.
 * 
 * Provides a layer of abstraction over NotionClient and handles
 * business logic for Notion page retrieval and processing.
 */
@Service
public class NotionService {

    private final NotionClient notionClient;
    private static final String NOTION_PAGE_NAME = "Rickym270.github.io";

    public NotionService(NotionClient notionClient) {
        this.notionClient = notionClient;
    }

    /**
     * Get entries from the Notion page "Rickym270.github.io"
     * @return Map containing page entries or empty map if not available
     */
    public Map<String, Object> getPageEntries() {
        if (!notionClient.isConfigured()) {
            return Collections.emptyMap();
        }

        try {
            Map<String, Object> page = notionClient.searchPageByTitle(NOTION_PAGE_NAME);
            if (page == null || page.isEmpty()) {
                // Try fetching by page name directly
                page = notionClient.fetchPage(NOTION_PAGE_NAME);
            }
            return page != null ? page : Collections.emptyMap();
        } catch (Exception e) {
            System.err.println("[NotionService] Error getting page entries: " + e.getMessage());
            return Collections.emptyMap();
        }
    }

    /**
     * Check if Notion integration is available
     * @return true if Notion API is configured
     */
    public boolean isAvailable() {
        return notionClient.isConfigured();
    }
}

