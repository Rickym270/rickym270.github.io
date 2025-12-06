import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

test.describe('Load and Stress Tests', () => {
  test.describe.configure({ timeout: 300000 }); // 5 minutes for load tests

  test('API handles concurrent requests', async ({ request }) => {
    // Send 10 concurrent requests
    const concurrentRequests = 10;
    const requests = [];
    
    for (let i = 0; i < concurrentRequests; i++) {
      requests.push(
        request.get(`${API_BASE_URL}/api/health`)
      );
    }
    
    const responses = await Promise.all(requests);
    
    // All requests should succeed
    responses.forEach((response, index) => {
      expect(response.ok()).toBeTruthy();
    });
    
    // Check response times (should be reasonable)
    const responseTimes = await Promise.all(
      responses.map(async (response) => {
        const start = Date.now();
        await response.json();
        return Date.now() - start;
      })
    );
    
    // Average response time should be under 1 second for health endpoint
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    expect(avgResponseTime).toBeLessThan(1000);
  });

  test('API handles rapid sequential requests', async ({ request }) => {
    // Send 20 rapid sequential requests
    const sequentialRequests = 20;
    const responseTimes: number[] = [];
    
    for (let i = 0; i < sequentialRequests; i++) {
      const start = Date.now();
      const response = await request.get(`${API_BASE_URL}/api/health`);
      const end = Date.now();
      
      expect(response.ok()).toBeTruthy();
      responseTimes.push(end - start);
    }
    
    // All requests should complete
    expect(responseTimes.length).toBe(sequentialRequests);
    
    // Average response time should remain reasonable
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    expect(avgResponseTime).toBeLessThan(2000);
  });

  test('API maintains performance under load', async ({ request }) => {
    // Send multiple requests and measure performance degradation
    const loadRequests = 50;
    const responseTimes: number[] = [];
    
    const requests = [];
    for (let i = 0; i < loadRequests; i++) {
      requests.push(
        request.get(`${API_BASE_URL}/api/health`).then(async (response) => {
          const start = Date.now();
          await response.json();
          return Date.now() - start;
        })
      );
    }
    
    const times = await Promise.all(requests);
    responseTimes.push(...times);
    
    // Calculate statistics
    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const maxTime = Math.max(...responseTimes);
    const minTime = Math.min(...responseTimes);
    
    // Average should be reasonable
    expect(avgTime).toBeLessThan(2000);
    
    // Max time should not be excessive (10 seconds)
    expect(maxTime).toBeLessThan(10000);
    
    // Min time should be fast
    expect(minTime).toBeLessThan(500);
  });

  test('API handles mixed request types under load', async ({ request }) => {
    // Mix of different endpoint requests
    const requests = [
      request.get(`${API_BASE_URL}/api/health`),
      request.get(`${API_BASE_URL}/api/meta`),
      request.get(`${API_BASE_URL}/api/stats`),
      request.get(`${API_BASE_URL}/api/projects`),
      request.get(`${API_BASE_URL}/api/health`),
      request.get(`${API_BASE_URL}/api/meta`),
      request.get(`${API_BASE_URL}/api/stats`),
    ];
    
    const responses = await Promise.all(requests);
    
    // All should succeed
    responses.forEach((response) => {
      expect(response.ok()).toBeTruthy();
    });
  });

  test('frontend handles rapid navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for initial content
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    const pages = ['Projects', 'Skills', 'Contact', 'Home'];
    const navigationTimes: number[] = [];
    
    // Navigate rapidly between pages
    for (let i = 0; i < 10; i++) {
      const pageName = pages[i % pages.length];
      const start = Date.now();
      
      if (isMobile) {
        await page.locator('#mobile-menu-toggle').click();
        await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
        await page.locator(`.mobile-nav-item:has-text("${pageName}")`).first().click();
      } else {
        await page.locator(`#navbar-links a:has-text("${pageName}")`).first().click();
      }
      
      // Wait for content to load
      await page.waitForFunction(() => {
        const c = document.querySelector('#content');
        return c?.getAttribute('data-content-loaded') === 'true' || c?.textContent?.length > 100;
      }, { timeout: 10000 });
      
      const end = Date.now();
      navigationTimes.push(end - start);
    }
    
    // Navigation should remain fast
    const avgNavTime = navigationTimes.reduce((a, b) => a + b, 0) / navigationTimes.length;
    expect(avgNavTime).toBeLessThan(5000); // 5 seconds average
    
    // Page should still be responsive
    const content = page.locator('#content');
    await expect(content).toBeVisible();
  });

  test('frontend handles multiple theme toggles', async ({ page }) => {
    // Firefox needs networkidle for reliable navigation
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    const timeout = browserName === 'firefox' ? 60000 : 20000;
    await page.goto('/', { waitUntil, timeout });
    
    // Wait for initial content
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Toggle theme multiple times rapidly
    for (let i = 0; i < 10; i++) {
      if (isMobile) {
        // Check if sidebar is already open
        const sidebar = page.locator('#mobile-sidebar');
        const classAttr = await sidebar.getAttribute('class');
        const isActive = classAttr ? classAttr.includes('active') : false;
        
        if (!isActive) {
          await page.locator('#mobile-menu-toggle').click();
          await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
        }
        
        await page.locator('#mobile-theme-toggle, [data-theme-toggle]').click();
        await page.waitForTimeout(200);
        
        // Close sidebar after toggle to prevent interference
        if (isActive) {
          await page.locator('body').click({ position: { x: 10, y: 10 } });
          await page.waitForTimeout(100);
        }
      } else {
        await page.locator('#theme-toggle, [data-theme-toggle]').click();
        await page.waitForTimeout(200);
      }
    }
    
    // Page should still be functional
    const content = page.locator('#content');
    await expect(content).toBeVisible();
    
    // Theme should be applied
    const theme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') || 
             document.body.className.includes('dark') ? 'dark' : 'light';
    });
    expect(['dark', 'light']).toContain(theme);
  });

  test('API handles burst traffic', async ({ request }) => {
    // Simulate burst traffic (many requests in short time)
    const burstSize = 30;
    const requests = [];
    
    for (let i = 0; i < burstSize; i++) {
      requests.push(request.get(`${API_BASE_URL}/api/health`));
    }
    
    const start = Date.now();
    const responses = await Promise.all(requests);
    const end = Date.now();
    
    // All should succeed
    responses.forEach((response) => {
      expect(response.ok()).toBeTruthy();
    });
    
    // Burst should complete in reasonable time (10 seconds for 30 requests)
    const totalTime = end - start;
    expect(totalTime).toBeLessThan(10000);
  });
});

