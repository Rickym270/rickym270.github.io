package com.rickym270.controllers;

import com.rickym270.api.ApiApplication;
import com.rickym270.services.ProjectsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ProjectsController.class)
@ContextConfiguration(classes = ApiApplication.class)
class ProjectsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectsService projectsService;

    @Test
    void testGetProjects() throws Exception {
        // Create sample project data
        Map<String, Object> project1 = new HashMap<>();
        project1.put("name", "Test Project 1");
        project1.put("slug", "test-project-1");
        project1.put("summary", "A test project");
        project1.put("repo", "https://github.com/rickym270/test-project-1");

        Map<String, Object> project2 = new HashMap<>();
        project2.put("name", "Test Project 2");
        project2.put("slug", "test-project-2");
        project2.put("summary", "Another test project");
        project2.put("repo", "https://github.com/rickym270/test-project-2");

        List<Map<String, Object>> projects = Arrays.asList(project1, project2);

        when(projectsService.getProjects(null)).thenReturn(projects);

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name").value("Test Project 1"))
                .andExpect(jsonPath("$[0].slug").value("test-project-1"))
                .andExpect(jsonPath("$[1].name").value("Test Project 2"));
    }

    @Test
    void testGetProjectsWithSourceParam() throws Exception {
        Map<String, Object> project = new HashMap<>();
        project.put("name", "Curated Project");
        project.put("slug", "curated-project");

        List<Map<String, Object>> projects = Arrays.asList(project);

        when(projectsService.getProjects("curated")).thenReturn(projects);

        mockMvc.perform(get("/api/projects")
                        .param("source", "curated"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Curated Project"));
    }

    @Test
    void testGetProjectsReturnsEmptyArray() throws Exception {
        when(projectsService.getProjects(null)).thenReturn(Arrays.asList());

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}
