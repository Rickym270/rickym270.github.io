package com.rickym270.clients;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Component
public class GitHubClient {

	/**
	 * Fetch all repositories for a GitHub user
	 * @param username GitHub username
	 * @return List of repository maps, or empty list on error
	 */
	public List<Map<String, Object>> fetchUserRepos(String username) {
		try {
			HttpHeaders headers = createHeaders();
			HttpEntity<Void> request = new HttpEntity<>(headers);
			
			String url = "https://api.github.com/users/" + username + "/repos?per_page=100&sort=updated";
			List<Map<String, Object>> repos = new RestTemplate()
				.exchange(url, org.springframework.http.HttpMethod.GET, request,
					new ParameterizedTypeReference<List<Map<String, Object>>>() {})
				.getBody();
			
			if (repos == null) {
				return Collections.emptyList();
			}
			
			return repos.stream()
				.filter(Objects::nonNull)
				.collect(java.util.stream.Collectors.toList());
		} catch (Exception ex) {
			System.err.println("[GitHubClient] Error fetching user repos for " + username + ": " + ex.getClass().getSimpleName() + ": " + ex.getMessage());
			return Collections.emptyList();
		}
	}
	
	/**
	 * Create HTTP headers with authentication token if available
	 * Uses GH_TOKEN environment variable
	 */
	private HttpHeaders createHeaders() {
		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
		headers.set("X-GitHub-Api-Version", "2022-11-28");
		
		String token = System.getenv("GH_TOKEN");
		if (token != null && !token.trim().isEmpty()) {
			headers.set("Authorization", "Bearer " + token.trim());
		}
		
		return headers;
	}
}

