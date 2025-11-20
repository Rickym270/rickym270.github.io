import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

test.describe('API Home Endpoint', () => {
  test('GET /api/home returns plain text', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/home`);
    expect(response.ok()).toBeTruthy();
    const text = await response.text();
    expect(text).toBe('Home');
  });

  test('GET /api/home has correct content type', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/home`);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('text/plain');
  });
});












