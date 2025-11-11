package com.rickym270.services;

import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class TurnstileService {
    private static final String VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public boolean verifyToken(String token, String remoteIp) {
        String secret = firstNonBlank(System.getenv("TURNSTILE_SECRET_KEY"), System.getProperty("TURNSTILE_SECRET_KEY"));
        if (isBlank(secret)) {
            // Not configured: allow in development
            System.out.println("[TurnstileService] Secret key not configured; skipping verification (allow).");
            return true;
        }
        try {
            String form = "secret=" + url(secret)
                        + "&response=" + url(token)
                        + (isBlank(remoteIp) ? "" : "&remoteip=" + url(remoteIp));
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(VERIFY_URL))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(form))
                .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            String body = response.body();
            boolean ok = response.statusCode() == 200 && body.contains("\"success\":true");
            if (!ok) {
                System.err.println("[TurnstileService] Verification failed: " + response.statusCode() + " body=" + body);
            }
            return ok;
        } catch (Exception e) {
            System.err.println("[TurnstileService] Verification error: " + e.getMessage());
            return false;
        }
    }

    private static String url(String v) {
        return URLEncoder.encode(v, StandardCharsets.UTF_8);
    }

    private static String firstNonBlank(String... values) {
        for (String v : values) {
            if (!isBlank(v)) return v.trim();
        }
        return null;
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}


