package com.rickym270.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
public class DotEnvConfig {

    @PostConstruct
    public void loadDotenv() {
        try {
            // Try multiple locations for .env file
            File envFile = null;
            String currentDir = System.getProperty("user.dir");
            
            // 1. Try .env in current working directory (most common when running from api/)
            File currentDirEnv = new File(".env");
            if (currentDirEnv.exists() && currentDirEnv.isFile()) {
                envFile = currentDirEnv.getAbsoluteFile();
            }
            
            // 2. Try api/.env (if running from repo root)
            if (envFile == null) {
                File apiEnv = new File("api", ".env");
                if (apiEnv.exists() && apiEnv.isFile()) {
                    envFile = apiEnv.getAbsoluteFile();
                }
            }
            
            // 3. Try parent directory .env
            if (envFile == null) {
                File parentEnv = new File("..", ".env");
                if (parentEnv.exists() && parentEnv.isFile()) {
                    envFile = parentEnv.getAbsoluteFile();
                }
            }
            
            if (envFile != null && envFile.exists()) {
                // Use absolute paths to avoid null directory issues
                String envDir = envFile.getParent();
                if (envDir == null) {
                    envDir = currentDir;
                }
                
                Dotenv dotenv = Dotenv.configure()
                    .directory(envDir)
                    .filename(envFile.getName())
                    .ignoreIfMissing()
                    .load();
                
                // Load all variables into system properties (which Spring can read)
                // Environment variables take precedence, so only set if not already set
                int loaded = 0;
                for (var entry : dotenv.entries()) {
                    String key = entry.getKey();
                    String value = entry.getValue();
                    // Skip empty values
                    if (value == null || value.trim().isEmpty()) {
                        continue;
                    }
                    // Only set if not already set as environment variable (env vars take precedence)
                    if (System.getenv(key) == null) {
                        System.setProperty(key, value);
                        loaded++;
                    }
                }
                
                System.out.println("[DotEnvConfig] ✓ Loaded " + loaded + " variables from .env file: " + envFile.getAbsolutePath());
                System.out.println("[DotEnvConfig] Current working directory: " + currentDir);
            } else {
                System.out.println("[DotEnvConfig] ⚠ No .env file found, using environment variables only");
                System.out.println("[DotEnvConfig] Current working directory: " + currentDir);
            }
        } catch (Exception e) {
            System.err.println("[DotEnvConfig] ✗ Error loading .env file: " + e.getMessage());
            e.printStackTrace();
            // Don't fail startup if .env file is missing or has errors
        }
    }
}

