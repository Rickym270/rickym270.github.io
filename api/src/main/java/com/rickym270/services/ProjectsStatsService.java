package com.rickym270.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class ProjectsStatsService {

    public int getCuratedProjectsCount() {
        return readCuratedProjects().size();
    }

    public List<String> getUniqueLanguages() {
        Set<String> unique = new HashSet<>();
        for (Map<String, Object> project : readCuratedProjects()) {
            Object techObj = project.get("tech");
            if (techObj instanceof List<?>) {
                for (Object t : (List<?>) techObj) {
                    if (t != null) {
                        String s = t.toString().trim();
                        if (!s.isEmpty()) unique.add(s);
                    }
                }
            }
        }
        return new ArrayList<>(unique);
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> readCuratedProjects() {
        ClassPathResource resource = new ClassPathResource("data/projects.json");
        try (InputStream input = resource.getInputStream()) {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(input, new TypeReference<List<Map<String, Object>>>() {});
        } catch (IOException e) {
            return List.of();
        }
    }
}



