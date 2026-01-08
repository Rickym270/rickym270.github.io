import { test, expect } from '@playwright/test';

// Use baseURL from project config if available, otherwise fallback to localhost:8080
// The 'api' project sets baseURL to http://localhost:8080
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

test.describe('API Contract Tests', () => {
  test.describe.configure({ timeout: 120000 });

  test('GET /api returns health response matching contract', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api`);
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    
    // Contract: HealthResponse should have status, version, time
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('version');
    expect(body).toHaveProperty('time');
    
    // Contract: status should be "UP"
    expect(body.status).toBe('UP');
    
    // Contract: version should be a string
    expect(typeof body.version).toBe('string');
    
    // Contract: time should be ISO-8601 format
    expect(body.time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  test('GET /api/health returns health response matching contract', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/health`);
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    
    // Contract: Same structure as GET /api
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('version');
    expect(body).toHaveProperty('time');
    expect(body.status).toBe('UP');
  });

  test('GET /api/meta returns metadata matching contract', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/meta`);
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    
    // Contract: MetaResponse should have name, title, location, languages, and link fields
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('location');
    expect(body).toHaveProperty('languages');
    
    // Contract: name and title should be strings
    expect(typeof body.name).toBe('string');
    expect(typeof body.title).toBe('string');
    
    // Contract: languages should be an array
    expect(Array.isArray(body.languages)).toBe(true);
    
    // Contract: Should have link fields (github, portfolio, etc.) - may be direct properties or in links object
    // API returns github and portfolio as direct properties
    expect(body.github || body.links?.github).toBeTruthy();
  });

  test('GET /api/projects returns projects array matching contract', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/projects`);
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    
    // Contract: Should return an array
    expect(Array.isArray(body)).toBe(true);
    
    if (body.length > 0) {
      const project = body[0];
      
      // Contract: Each project should have required fields
      expect(project).toHaveProperty('name');
      // API returns 'summary' not 'description', and 'repo' not 'url'
      expect(project).toHaveProperty('summary');
      expect(project).toHaveProperty('repo');
      
      // Contract: name and summary should be strings
      expect(typeof project.name).toBe('string');
      expect(typeof project.summary).toBe('string');
      
      // Contract: repo should be a string (URL)
      expect(typeof project.repo).toBe('string');
      
      // Contract: tech should be an array (if present)
      if (project.tech) {
        expect(Array.isArray(project.tech)).toBe(true);
      }
    }
  });

  test('GET /api/stats returns stats matching contract', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/stats`);
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    
    // Contract: StatsResponse should have projects (or projectsCount), languages (or uniqueLanguages), lastUpdated
    // API returns 'projects' not 'projectsCount', and 'languages' not 'uniqueLanguages'
    expect(body).toHaveProperty('projects');
    expect(body).toHaveProperty('languages');
    expect(body).toHaveProperty('lastUpdated');
    
    // Contract: projects should be a number
    expect(typeof body.projects).toBe('number');
    expect(body.projects).toBeGreaterThanOrEqual(0);
    
    // Contract: languages should be an array
    expect(Array.isArray(body.languages)).toBe(true);
    
    // Contract: lastUpdated should be ISO-8601 format
    expect(body.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  test('POST /api/contact returns contact response matching contract', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/contact`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        name: 'Contract Test',
        email: 'contract@test.com',
        subject: 'Contract Test Subject',
        message: 'Testing API contract compliance'
      },
      timeout: 30000
    });
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);
    
    const body = await response.json();
    
    // Contract: ContactResponse should have id, name, email, subject, message, receivedAt
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('email');
    expect(body).toHaveProperty('subject');
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('receivedAt');
    
    // Contract: All fields should match input (except id and receivedAt)
    expect(body.name).toBe('Contract Test');
    expect(body.email).toBe('contract@test.com');
    expect(body.subject).toBe('Contract Test Subject');
    expect(body.message).toBe('Testing API contract compliance');
    
    // Contract: receivedAt should be ISO-8601 format
    expect(body.receivedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  test('POST /api/contact with invalid data returns error matching contract', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/contact`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        name: '',
        email: 'invalid-email',
        subject: '',
        message: ''
      },
      failOnStatusCode: false
    });
    
    expect(response.status()).toBe(422);
    
    const body = await response.json();
    
    // Contract: ErrorResponse should have error, message, time
    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('time');
    
    // Contract: error should be "validation_error"
    expect(body.error).toBe('validation_error');
    
    // Contract: message should be a string
    expect(typeof body.message).toBe('string');
    
    // Contract: time should be ISO-8601 format
    expect(body.time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  test('GET /api/contact without API key returns error matching contract', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/contact`, {
      failOnStatusCode: false
    });
    
    expect(response.status()).toBe(401);
    
    const body = await response.json();
    
    // Contract: ErrorResponse structure
    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('time');
    
    // Contract: error should be "unauthorized"
    expect(body.error).toBe('unauthorized');
  });

  test('GET /api/nonexistent returns 404 error matching contract', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/nonexistent`, {
      failOnStatusCode: false
    });
    
    expect(response.status()).toBe(404);
    
    const body = await response.json();
    
    // Contract: ErrorResponse structure
    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('time');
    
    // Contract: error should be "not_found"
    expect(body.error).toBe('not_found');
  });

  test('POST /api/contact with wrong Content-Type returns error matching contract', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/contact`, {
      headers: { 'Content-Type': 'text/plain' },
      data: 'invalid',
      failOnStatusCode: false
    });
    
    expect(response.status()).toBe(415);
    
    const body = await response.json();
    
    // Contract: ErrorResponse structure
    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('time');
    
    // Contract: error should be "unsupported_media_type"
    expect(body.error).toBe('unsupported_media_type');
  });

  test('PUT /api/contact returns 405 error matching contract', async ({ request }) => {
    const response = await request.put(`${API_BASE_URL}/api/contact`, {
      headers: { 'Content-Type': 'application/json' },
      data: {},
      failOnStatusCode: false
    });
    
    expect(response.status()).toBe(405);
    
    const body = await response.json();
    
    // Contract: ErrorResponse structure
    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('time');
    
    // Contract: error should be "method_not_allowed"
    expect(body.error).toBe('method_not_allowed');
  });

  test('GET /api/github/activity returns activity array matching contract', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/github/activity`);
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    
    // Contract: Should return an array
    expect(Array.isArray(body)).toBe(true);
    
    if (body.length > 0) {
      const activity = body[0];
      
      // Contract: Each activity should have type, repo, createdAt
      expect(activity).toHaveProperty('type');
      expect(activity).toHaveProperty('repo');
      expect(activity).toHaveProperty('createdAt');
      
      // Contract: type and repo should be strings
      expect(typeof activity.type).toBe('string');
      expect(typeof activity.repo).toBe('string');
      
      // Contract: createdAt should be ISO-8601 format
      expect(activity.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    }
  });

  test('GET /api/home returns home text matching contract', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/home`);
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    // Contract: API returns plain text, not JSON
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('text/plain');
    
    const bodyText = await response.text();
    
    // Contract: Should return a non-empty string
    expect(typeof bodyText).toBe('string');
    expect(bodyText.length).toBeGreaterThan(0);
  });

  test('all API responses have correct Content-Type header', async ({ request }) => {
    const jsonEndpoints = [
      '/api',
      '/api/health',
      '/api/meta',
      '/api/projects',
      '/api/stats',
      '/api/github/activity'
    ];
    
    // Test JSON endpoints
    for (const endpoint of jsonEndpoints) {
      const response = await request.get(`${API_BASE_URL}${endpoint}`);
      const headers = response.headers();
      
      // Contract: Content-Type should be application/json for JSON endpoints
      expect(headers['content-type']).toContain('application/json');
    }
    
    // Test text endpoint separately
    const textResponse = await request.get(`${API_BASE_URL}/api/home`);
    const textHeaders = textResponse.headers();
    
    // Contract: /api/home returns text/plain
    expect(textHeaders['content-type']).toContain('text/plain');
  });
});

