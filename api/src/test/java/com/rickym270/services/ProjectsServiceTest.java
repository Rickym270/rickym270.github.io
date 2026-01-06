package com.rickym270.services;

import com.rickym270.clients.GitHubClient;
import com.rickym270.config.FeatureFlags;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.core.env.Environment;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ProjectsService focusing on caching and rate limit handling improvements.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ProjectsServiceTest {

    @Mock
    private FeatureFlags featureFlags;

    @Mock
    private GitHubClient gitHubClient;

    @Mock
    private Environment env;

    private ProjectsService projectsService;

    @BeforeEach
    void setUp() {
        when(featureFlags.githubProjectSyncEnabled()).thenReturn(true);
        when(env.getProperty("PROJECTS_GITHUB_TTL_MINUTES")).thenReturn(null);
        when(env.getProperty("PROJECTS_COMMIT_STATUS_TTL_MINUTES")).thenReturn(null);

        projectsService = new ProjectsService(featureFlags, gitHubClient, env);
    }

    @Test
    void testGetProjectsReturnsCuratedWhenFeatureFlagDisabled() {
        when(featureFlags.githubProjectSyncEnabled()).thenReturn(false);

        List<Map<String, Object>> projects = projectsService.getProjects(null);

        assertNotNull(projects);
        // Should return curated projects even when GitHub is disabled
        verify(gitHubClient, never()).fetchUserRepos(anyString());
    }

    @Test
    void testGetProjectsReturnsCuratedOnlyWhenSourceIsCurated() {
        List<Map<String, Object>> projects = projectsService.getProjects("curated");

        assertNotNull(projects);
        // Should return curated projects without GitHub API calls
        verify(gitHubClient, never()).fetchUserRepos(anyString());
    }

    @Test
    void testDefaultTtlIs720Minutes() {
        // Test that default TTL is 720 minutes (12 hours) as per improvements
        when(env.getProperty("PROJECTS_GITHUB_TTL_MINUTES")).thenReturn(null);
        
        // Access private method via reflection to test TTL
        Object result = ReflectionTestUtils.invokeMethod(projectsService, "getTtlMinutes");
        assertNotNull(result, "TTL method should return a value");
        long ttl = ((Long) result).longValue();
        
        assertEquals(720, ttl, "Default TTL should be 720 minutes (12 hours)");
    }

    @Test
    void testCustomTtlIsRespected() {
        when(env.getProperty("PROJECTS_GITHUB_TTL_MINUTES")).thenReturn("360");
        
        Object result = ReflectionTestUtils.invokeMethod(projectsService, "getTtlMinutes");
        assertNotNull(result, "TTL method should return a value");
        long ttl = ((Long) result).longValue();
        
        assertEquals(360, ttl, "Custom TTL should be respected");
    }

    @Test
    void testCommitStatusCacheTtlDefault() {
        // Test that default commit status cache TTL is 60 minutes
        when(env.getProperty("PROJECTS_COMMIT_STATUS_TTL_MINUTES")).thenReturn(null);
        
        Object result = ReflectionTestUtils.invokeMethod(projectsService, "getCommitStatusTtlMinutes");
        assertNotNull(result, "Commit status TTL method should return a value");
        long ttl = ((Long) result).longValue();
        
        assertEquals(60, ttl, "Default commit status cache TTL should be 60 minutes");
    }

    @Test
    void testCommitStatusCacheTtlCustom() {
        when(env.getProperty("PROJECTS_COMMIT_STATUS_TTL_MINUTES")).thenReturn("30");
        
        Object result = ReflectionTestUtils.invokeMethod(projectsService, "getCommitStatusTtlMinutes");
        assertNotNull(result, "Commit status TTL method should return a value");
        long ttl = ((Long) result).longValue();
        
        assertEquals(30, ttl, "Custom commit status cache TTL should be respected");
    }

    @Test
    void testGetProjectsHandlesEmptyGitHubResponse() {
        when(gitHubClient.fetchUserRepos(anyString())).thenReturn(Collections.emptyList());

        List<Map<String, Object>> projects = projectsService.getProjects(null);

        assertNotNull(projects);
        // Should return curated projects when GitHub returns empty
        assertTrue(projects.size() > 0, "Should return curated projects when GitHub is empty");
    }

    @Test
    void testGetProjectsHandlesGitHubException() {
        when(gitHubClient.fetchUserRepos(anyString())).thenThrow(new RuntimeException("API Error"));

        List<Map<String, Object>> projects = projectsService.getProjects(null);

        assertNotNull(projects);
        // Should return curated projects when GitHub fails
        assertTrue(projects.size() > 0, "Should return curated projects when GitHub fails");
    }
}

