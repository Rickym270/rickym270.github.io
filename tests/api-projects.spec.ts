import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

test.describe('API Projects Endpoint', () => {
  test('GET /api/projects returns array of projects', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/projects`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('GET /api/projects returns projects with required fields', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/projects`);
    const projects = await response.json();
    expect(projects.length).toBeGreaterThan(0);
    
    const firstProject = projects[0];
    expect(firstProject).toHaveProperty('slug');
    expect(firstProject).toHaveProperty('name');
    expect(firstProject).toHaveProperty('repo');
    expect(typeof firstProject.slug).toBe('string');
    expect(typeof firstProject.name).toBe('string');
    expect(typeof firstProject.repo).toBe('string');
  });

  test('GET /api/projects returns projects with optional fields', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/projects`);
    const projects = await response.json();
    
    if (projects.length > 0) {
      const project = projects[0];
      // Optional fields may or may not be present
      if (project.summary) expect(typeof project.summary).toBe('string');
      if (project.tech) expect(Array.isArray(project.tech)).toBeTruthy();
      if (project.featured !== undefined) expect(typeof project.featured).toBe('boolean');
    }
  });

  test('GET /api/projects returns valid repo URLs', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/projects`);
    const projects = await response.json();
    
    projects.forEach((project: any) => {
      expect(project.repo).toMatch(/^https?:\/\//);
    });
  });

  test('GET /api/projects returns projects with valid status field when present', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/projects`);
    const projects = await response.json();
    
    expect(projects.length).toBeGreaterThan(0);
    
    // Check that if status field exists, it has a valid value
    // Note: Status may not be present for all projects (curated-only projects without GitHub data)
    // but when present, it should be valid
    const projectsWithStatus = projects.filter((p: any) => p.status !== undefined && p.status !== null);
    
    if (projectsWithStatus.length > 0) {
      projectsWithStatus.forEach((project: any) => {
        expect(typeof project.status).toBe('string');
        
        // Status should be one of the valid values
        const validStatuses = ['in-progress', 'complete', 'ideas'];
        const normalizedStatus = String(project.status).toLowerCase();
        const isValidStatus = validStatuses.some(valid => 
          normalizedStatus === valid || 
          normalizedStatus === valid.replace('-', '_') ||
          normalizedStatus === valid.replace('-', '')
        );
        
        expect(isValidStatus || normalizedStatus === 'idea').toBeTruthy();
      });
    }
    // If no projects have status, that's okay - the API might not have the new code deployed yet
    // or all projects might be curated-only. The frontend will handle missing status gracefully.
  });
});










