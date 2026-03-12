import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

test.describe('API Sanity (simple GET 200)', () => {
  test('[sanity] GET /api returns 200', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test('[sanity] GET /api/health returns 200', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/health`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test('[sanity] GET /api/meta returns 200', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/meta`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test('[sanity] GET /api/stats returns 200', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/stats`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test('[sanity] GET /api/projects returns 200', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/projects`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test('[sanity] GET /api/home returns 200', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/home`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });
});
