package com.rickym270.services;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

@Service
public class TurnstileService {

    private static final String TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    private final RestClient restClient;

    public TurnstileService() {
        this.restClient = RestClient.create();
    }

    /**
     * Verifies a Turnstile token with Cloudflare
     * @param token The Turnstile token from the frontend
     * @param clientIp The client's IP address (optional, for additional security)
     * @return true if token is valid, false otherwise
     */
    public boolean verifyToken(String token, String clientIp) {
        if (token == null || token.trim().isEmpty()) {
            return false;
        }

        String secretKey = getSecretKey();
        if (secretKey == null || secretKey.trim().isEmpty()) {
            // If no secret key is configured, skip verification (for local dev)
            System.err.println("[TurnstileService] Warning: TURNSTILE_SECRET_KEY not set, skipping verification");
            return true;
        }

        try {
            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("secret", secretKey);
            formData.add("response", token);
            if (clientIp != null && !clientIp.equals("unknown")) {
                formData.add("remoteip", clientIp);
            }

            var response = restClient.post()
                .uri(TURNSTILE_VERIFY_URL)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(formData)
                .retrieve()
                .body(java.util.Map.class);

            if (response == null) {
                return false;
            }

            Boolean success = (Boolean) response.get("success");
            return Boolean.TRUE.equals(success);
        } catch (Exception e) {
            System.err.println("[TurnstileService] Error verifying token: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    private String getSecretKey() {
        String env = System.getenv("TURNSTILE_SECRET_KEY");
        if (env != null && !env.trim().isEmpty()) {
            return env.trim();
        }
        String prop = System.getProperty("TURNSTILE_SECRET_KEY");
        return prop != null && !prop.trim().isEmpty() ? prop.trim() : null;
    }
}

