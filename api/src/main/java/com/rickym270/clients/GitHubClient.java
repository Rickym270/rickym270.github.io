package com.rickym270.clients;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GitHubClient {

	private static final String USER = "rickym270";
	private static final String EVENTS_URL = "https://api.github.com/users/" + USER + "/events/public?per_page=10";

	public List<Map<String, Object>> fetchRecentActivity() {
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
			headers.set("X-GitHub-Api-Version", "2022-11-28");
			String token = System.getenv("GITHUB_TOKEN");
			if (token != null && !token.trim().isEmpty()) {
				headers.set("Authorization", "Bearer " + token.trim());
			}
			HttpEntity<Void> request = new HttpEntity<>(headers);

			List<Map<String, Object>> events = new RestTemplate()
				.exchange(EVENTS_URL, org.springframework.http.HttpMethod.GET, request,
					new ParameterizedTypeReference<List<Map<String, Object>>>() {})
				.getBody();

			if (events == null) return Collections.emptyList();

			List<Map<String, Object>> simplified = new ArrayList<>();
			for (Map<String, Object> ev : events) {
				if (ev == null) continue;
				String type = String.valueOf(ev.getOrDefault("type", ""));
				Map<String, Object> repo = safeMap(ev.get("repo"));
				String repoName = String.valueOf(repo.getOrDefault("name", ""));
				String createdAt = String.valueOf(ev.getOrDefault("created_at", ""));

				Map<String, Object> out = new HashMap<>();
				out.put("type", type);
				out.put("repo", repoName);
				out.put("createdAt", createdAt);
				simplified.add(out);
			}
			return simplified;
		} catch (RestClientException e) {
			return Collections.emptyList();
		}
	}

	@SuppressWarnings("unchecked")
	private Map<String, Object> safeMap(Object obj) {
		if (obj instanceof Map<?, ?> m) {
			return (Map<String, Object>) m;
		}
		return Collections.emptyMap();
	}
}

