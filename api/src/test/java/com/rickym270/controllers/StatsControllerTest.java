package com.rickym270.controllers;

import com.rickym270.api.ApiApplication;
import com.rickym270.services.ProjectsStatsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = StatsController.class)
@ContextConfiguration(classes = ApiApplication.class)
class StatsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectsStatsService statsService;

    @Test
    void testGetStats() throws Exception {
        when(statsService.getCuratedProjectsCount()).thenReturn(10);
        when(statsService.getUniqueLanguages()).thenReturn(Arrays.asList("Java", "Python", "JavaScript"));

        mockMvc.perform(get("/api/stats"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.projects").value(10))
                .andExpect(jsonPath("$.languages").isArray())
                .andExpect(jsonPath("$.languages", hasSize(3)))
                .andExpect(jsonPath("$.languages", hasItems("Java", "Python", "JavaScript")))
                .andExpect(jsonPath("$.lastUpdated").exists())
                .andExpect(jsonPath("$.lastUpdated").isString());
    }

    @Test
    void testGetStatsWithZeroProjects() throws Exception {
        when(statsService.getCuratedProjectsCount()).thenReturn(0);
        when(statsService.getUniqueLanguages()).thenReturn(Arrays.asList());

        mockMvc.perform(get("/api/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projects").value(0))
                .andExpect(jsonPath("$.languages").isArray())
                .andExpect(jsonPath("$.languages", hasSize(0)));
    }

    @Test
    void testStatsResponseContainsRequiredFields() throws Exception {
        when(statsService.getCuratedProjectsCount()).thenReturn(5);
        when(statsService.getUniqueLanguages()).thenReturn(Arrays.asList("Java"));

        mockMvc.perform(get("/api/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projects").exists())
                .andExpect(jsonPath("$.languages").exists())
                .andExpect(jsonPath("$.lastUpdated").exists());
    }
}
