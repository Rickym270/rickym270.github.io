import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

test.describe('API Stats Endpoint', () => {
  test('GET /api/stats returns statistics', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/stats`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('projects');
    expect(body).toHaveProperty('languages');
    expect(body).toHaveProperty('lastUpdated');
  });

  test('GET /api/stats returns correct data types', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/stats`);
    const body = await response.json();
    expect(typeof body.projects).toBe('number');
    expect(body.projects).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(body.languages)).toBeTruthy();
    expect(typeof body.lastUpdated).toBe('string');
    // Verify ISO-8601 timestamp format
    expect(body.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  test('GET /api/stats languages is array of strings', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/stats`);
    const body = await response.json();
    body.languages.forEach((lang: any) => {
      expect(typeof lang).toBe('string');
      expect(lang.length).toBeGreaterThan(0);
    });
  });
});











