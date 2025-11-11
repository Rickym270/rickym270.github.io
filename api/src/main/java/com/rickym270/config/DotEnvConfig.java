package com.rickym270.config;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvEntry;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class DotEnvConfig {

    @PostConstruct
    public void loadEnvFile() {
        try {
            // Try current directory first (when running from api/), then api/ relative to repo root
            Dotenv dotenv = Dotenv.configure()
                .filename(".env")
                .ignoreIfMissing()
                .load();
            
            // If not found, try api/.env relative to repo root (when running from repo root)
            if (dotenv.entries().isEmpty()) {
                dotenv = Dotenv.configure()
                    .directory("api")
                    .filename(".env")
                    .ignoreIfMissing()
                    .load();
            }

            int loaded = 0;
            for (DotenvEntry e : dotenv.entries()) {
                String key = e.getKey();
                String value = e.getValue();
                // Skip placeholders like "your-..." to avoid misconfiguration
                if (value == null || value.trim().isEmpty() || value.startsWith("your-")) {
                    continue;
                }
                // Don't override actual environment variables
                if (System.getenv(key) == null) {
                    System.setProperty(key, value);
                    loaded++;
                }
            }
            if (loaded > 0) {
                System.out.println("[DotEnvConfig] \u2713 Loaded " + loaded + " variables from .env file in api/");
            } else {
                System.out.println("[DotEnvConfig] No .env variables loaded (file missing or all values empty/placeholder)");
            }
        } catch (Exception e) {
            System.out.println("[DotEnvConfig] Skipped loading .env: " + e.getMessage());
        }
    }
}


