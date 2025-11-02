import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

test.describe('API GitHub Activity Endpoint', () => {
  test('GET /api/github/activity returns array', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/github/activity`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    // May be empty if no recent activity or GitHub API unavailable
  });

  test('GET /api/github/activity returns events with correct structure', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/github/activity`);
    const events = await response.json();
    
    if (events.length > 0) {
      const event = events[0];
      expect(event).toHaveProperty('type');
      expect(event).toHaveProperty('repo');
      expect(event).toHaveProperty('createdAt');
      expect(typeof event.type).toBe('string');
      expect(typeof event.repo).toBe('string');
      expect(typeof event.createdAt).toBe('string');
    }
  });

  test('GET /api/github/activity returns valid timestamps', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/github/activity`);
    const events = await response.json();
    
    events.forEach((event: any) => {
      // Verify ISO-8601 timestamp format
      expect(event.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });
});



