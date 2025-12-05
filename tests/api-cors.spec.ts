import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

test.describe('API CORS Configuration', () => {
  test('GET /api/health includes CORS headers for localhost origin', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/health`, {
      headers: {
        'Origin': 'http://localhost:4321'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    
    // Check for CORS headers
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBeTruthy();
    // Credentials header may be present if origin matches pattern
    if (headers['access-control-allow-credentials']) {
      expect(headers['access-control-allow-credentials']).toBe('true');
    }
  });

  test('OPTIONS preflight request works correctly', async ({ request }) => {
    // Use request.fetch() with method: 'OPTIONS' since request.options() doesn't exist
    const response = await request.fetch(`${API_BASE_URL}/api/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:4321',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    // Preflight requests should return 200 or 204
    expect([200, 204]).toContain(response.status());
    
    // Check for CORS preflight headers
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBeTruthy();
    expect(headers['access-control-allow-methods']).toBeTruthy();
    expect(headers['access-control-allow-credentials']).toBe('true');
    expect(headers['access-control-max-age']).toBeTruthy();
  });

  test('CORS allows localhost:4321 origin', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/health`, {
      headers: {
        'Origin': 'http://localhost:4321'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const headers = response.headers();
    // Should allow localhost:4321 (either exact match or via pattern)
    const allowOrigin = headers['access-control-allow-origin'];
    expect(allowOrigin).toBeTruthy();
    // Should be either the exact origin or a pattern match (localhost:*)
    expect(allowOrigin === 'http://localhost:4321' || allowOrigin.includes('localhost')).toBeTruthy();
  });

  test('CORS allows localhost:8080 origin', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/health`, {
      headers: {
        'Origin': 'http://localhost:8080'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const headers = response.headers();
    // CORS header should be present (either exact match or pattern match)
    const allowOrigin = headers['access-control-allow-origin'];
    expect(allowOrigin).toBeTruthy();
    // Should match localhost:8080 (either exact or via pattern)
    expect(allowOrigin === 'http://localhost:8080' || allowOrigin.includes('localhost')).toBeTruthy();
  });

  test('CORS allows production domain origin', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/health`, {
      headers: {
        'Origin': 'https://rickym270.github.io'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBe('https://rickym270.github.io');
  });

  test('CORS allows common HTTP methods', async ({ request }) => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'];
    
    for (const method of methods) {
      const response = await request.fetch(`${API_BASE_URL}/api/health`, {
        method: method as any,
        headers: {
          'Origin': 'http://localhost:4321'
        }
      });
      
      // Method might not be allowed for /api/health, but CORS headers should be present
      const headers = response.headers();
      if (response.status() !== 405) {
        // If method is allowed, CORS headers should be present
        expect(headers['access-control-allow-origin']).toBeTruthy();
      }
    }
  });
});

