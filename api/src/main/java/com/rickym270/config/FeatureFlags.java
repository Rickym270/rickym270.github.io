package com.rickym270.config;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/**
 * Feature flags for controlling application behavior via environment variables.
 * 
 * This component provides feature flag functionality, allowing features to be
 * enabled/disabled based on environment configuration. This is particularly useful
 * for disabling external API integrations in CI environments.
 */
@Component
public class FeatureFlags {

    private final Environment env;

    public FeatureFlags(Environment env) {
        this.env = env;
    }

    /**
     * Check if GitHub project synchronization is enabled.
     * 
     * Reads FEATURE_GITHUB_PROJECT_SYNC environment variable.
     * Defaults to true if not set (feature enabled by default).
     * 
     * @return true if GitHub project sync is enabled, false otherwise
     */
    public boolean githubProjectSyncEnabled() {
        String value = env.getProperty("FEATURE_GITHUB_PROJECT_SYNC");
        if (value == null || value.trim().isEmpty()) {
            return true; // Default to enabled
        }
        return "true".equalsIgnoreCase(value.trim());
    }
}

