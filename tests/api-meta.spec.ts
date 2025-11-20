import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

test.describe('API Meta Endpoint', () => {
  test('GET /api/meta returns profile metadata', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/meta`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('name', 'Ricky Martinez');
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('location');
    expect(body).toHaveProperty('languages');
    expect(Array.isArray(body.languages)).toBeTruthy();
    expect(body).toHaveProperty('github');
    expect(body).toHaveProperty('portfolio');
  });

  test('GET /api/meta returns correct structure', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/meta`);
    const body = await response.json();
    expect(body.github).toContain('github.com');
    expect(body.portfolio).toContain('rickym270.github.io');
    expect(body.languages.length).toBeGreaterThan(0);
  });
});












