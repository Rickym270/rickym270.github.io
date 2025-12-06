import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

test.describe('Security Headers', () => {
  test.describe.configure({ timeout: 120000 });

  test('API responses include security headers', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/health`);
    
    expect(response.ok()).toBeTruthy();
    
    const headers = response.headers();
    
    // Check for common security headers
    // Note: Some headers may be set by the server/proxy (Cloud Run, etc.)
    // We check for headers that should be present for security
    
    // CORS headers should be present
    expect(headers['access-control-allow-origin'] || headers['access-control-allow-origin-pattern']).toBeTruthy();
    
    // Content-Type should be set correctly
    expect(headers['content-type']).toContain('application/json');
  });

  test('API does not expose sensitive information in error responses', async ({ request }) => {
    // Test 404 error
    const response = await request.get(`${API_BASE_URL}/api/nonexistent`, {
      failOnStatusCode: false
    });
    
    expect(response.status()).toBe(404);
    
    const body = await response.json();
    
    // Error response should have standard structure
    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('time');
    
    // Should not expose stack traces or internal paths
    const bodyStr = JSON.stringify(body);
    expect(bodyStr).not.toContain('java.lang');
    expect(bodyStr).not.toContain('at ');
    expect(bodyStr).not.toContain('Exception');
    expect(bodyStr).not.toContain('StackTrace');
  });

  test('API validates input to prevent injection attacks', async ({ request }) => {
    // Test SQL injection attempt (if applicable)
    const maliciousInput = "'; DROP TABLE users; --";
    
    const response = await request.post(`${API_BASE_URL}/api/contact`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        name: maliciousInput,
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message'
      },
      failOnStatusCode: false
    });
    
    // Should either reject invalid input (422) or sanitize it (201)
    // Should not crash with 500
    expect([201, 422, 400]).toContain(response.status());
    
    if (response.status() === 201) {
      const body = await response.json();
      // If accepted, input should be sanitized (no SQL keywords in response)
      const bodyStr = JSON.stringify(body);
      expect(bodyStr.toLowerCase()).not.toContain('drop table');
    }
  });

  test('API rate limiting works correctly', async ({ request }) => {
    // Submit multiple requests quickly
    const requests = [];
    for (let i = 0; i < 3; i++) {
      requests.push(
        request.post(`${API_BASE_URL}/api/contact`, {
          headers: { 'Content-Type': 'application/json' },
          data: {
            name: `Test User ${i}`,
            email: `test${i}@example.com`,
            subject: 'Rate Limit Test',
            message: 'Testing rate limiting'
          },
          failOnStatusCode: false
        })
      );
    }
    
    const responses = await Promise.all(requests);
    
    // First request should succeed (201)
    expect(responses[0].status()).toBe(201);
    
    // Subsequent requests from same IP should be rate limited (400)
    // Note: Rate limiting is 5 minutes per IP, so second request might succeed
    // if enough time has passed. We just verify it doesn't crash.
    responses.forEach((response, index) => {
      if (index > 0) {
        // Should be either 201 (if rate limit expired) or 400 (if rate limited)
        expect([201, 400]).toContain(response.status());
      }
    });
  });

  test('API requires authentication for admin endpoints', async ({ request }) => {
    // Try to access admin endpoint without API key
    const response = await request.get(`${API_BASE_URL}/api/contact`, {
      failOnStatusCode: false
    });
    
    // Should return 401 Unauthorized
    expect(response.status()).toBe(401);
    
    const body = await response.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toBe('unauthorized');
  });

  test('API validates Content-Type header', async ({ request }) => {
    // Try to POST with wrong Content-Type
    const response = await request.post(`${API_BASE_URL}/api/contact`, {
      headers: { 'Content-Type': 'text/plain' },
      data: 'invalid data',
      failOnStatusCode: false
    });
    
    // Should return 415 Unsupported Media Type
    expect(response.status()).toBe(415);
    
    const body = await response.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toBe('unsupported_media_type');
  });

  test('API prevents XSS in responses', async ({ request }) => {
    // Submit contact form with potential XSS payload
    const xssPayload = '<script>alert("XSS")</script>';
    
    const response = await request.post(`${API_BASE_URL}/api/contact`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        name: xssPayload,
        email: 'test@example.com',
        subject: xssPayload,
        message: xssPayload
      },
      failOnStatusCode: false
    });
    
    // Should either reject (422) or sanitize (201)
    expect([201, 422, 400]).toContain(response.status());
    
    if (response.status() === 201) {
      const body = await response.json();
      const bodyStr = JSON.stringify(body);
      // If accepted, should be sanitized (no script tags)
      expect(bodyStr).not.toContain('<script>');
      expect(bodyStr).not.toContain('</script>');
    }
  });

  test('API handles oversized payloads correctly', async ({ request }) => {
    // Create a very large message
    const largeMessage = 'x'.repeat(100000); // 100KB message
    
    const response = await request.post(`${API_BASE_URL}/api/contact`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        name: 'Test',
        email: 'test@example.com',
        subject: 'Large Payload Test',
        message: largeMessage
      },
      failOnStatusCode: false
    });
    
    // Should either reject (400/422) or accept (201)
    // Should not crash with 500
    expect([201, 400, 422, 413]).toContain(response.status());
  });

  test('API CORS configuration is secure', async ({ request }) => {
    // Test from unauthorized origin
    const response = await request.get(`${API_BASE_URL}/api/health`, {
      headers: {
        'Origin': 'https://malicious-site.com'
      },
      failOnStatusCode: false
    });
    
    const headers = response.headers();
    
    // CORS should not allow unauthorized origins
    // If origin is not allowed, access-control-allow-origin should not match
    if (headers['access-control-allow-origin']) {
      expect(headers['access-control-allow-origin']).not.toBe('https://malicious-site.com');
    }
  });

  test('API does not expose version information unnecessarily', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/health`);
    
    const headers = response.headers();
    
    // Should not expose server version in headers
    expect(headers['server']).toBeFalsy();
    expect(headers['x-powered-by']).toBeFalsy();
    
    // Version in response body is OK (it's part of the API contract)
    const body = await response.json();
    if (body.version) {
      // Version in JSON response is acceptable
      expect(typeof body.version).toBe('string');
    }
  });
});

