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
});






