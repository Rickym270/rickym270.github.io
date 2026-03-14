import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

test.describe('[regression] API Search Endpoint', () => {
  test.describe.configure({ timeout: 120000 });

  test('GET /api/search without q returns 200 and array', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/search`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /api/search?q= returns 200 and array', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/search?q=`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /api/search?q=engineering returns 200 and array of result objects', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/search?q=engineering`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);

    for (const item of body) {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('url');
      expect(item).toHaveProperty('score');
      expect(typeof item.score).toBe('number');
    }
  });

  test('GET /api/search?q=disability returns at least one result', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/search?q=disability`);

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(1);
  });
});
