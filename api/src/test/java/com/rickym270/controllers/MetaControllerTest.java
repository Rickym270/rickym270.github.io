package com.rickym270.controllers;

import com.rickym270.api.ApiApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = MetaController.class)
@ContextConfiguration(classes = ApiApplication.class)
class MetaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetMeta() throws Exception {
        mockMvc.perform(get("/api/meta"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.name").value("Ricky Martinez"))
                .andExpect(jsonPath("$.title").value("Senior SDET / Developer in Test"))
                .andExpect(jsonPath("$.location").value("New York, USA"))
                .andExpect(jsonPath("$.languages").isArray())
                .andExpect(jsonPath("$.languages", hasSize(3)))
                .andExpect(jsonPath("$.languages", hasItems("English", "Spanish", "German")))
                .andExpect(jsonPath("$.github").value("https://github.com/rickym270"))
                .andExpect(jsonPath("$.portfolio").value("https://rickym270.github.io"));
    }

    @Test
    void testMetaResponseContainsRequiredFields() throws Exception {
        mockMvc.perform(get("/api/meta"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").exists())
                .andExpect(jsonPath("$.title").exists())
                .andExpect(jsonPath("$.location").exists())
                .andExpect(jsonPath("$.languages").exists())
                .andExpect(jsonPath("$.github").exists())
                .andExpect(jsonPath("$.portfolio").exists());
    }
}
