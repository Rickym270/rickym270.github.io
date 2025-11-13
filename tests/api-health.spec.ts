import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

test.describe('API Health Endpoints', () => {
  test('GET /api returns health status', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('status', 'UP');
    expect(body).toHaveProperty('version');
    expect(body).toHaveProperty('time');
  });

  test('GET /api/health returns health status', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/health`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('status', 'UP');
    expect(body).toHaveProperty('version');
    expect(body).toHaveProperty('time');
  });

  test('GET /api/invalid returns 404', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/invalid`);
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('error', 'not_found');
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('time');
  });

  test('POST /api returns 405 (method not allowed)', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api`);
    expect(response.status()).toBe(405);
    const body = await response.json();
    expect(body).toHaveProperty('error', 'method_not_allowed');
  });
});









