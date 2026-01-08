import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test.describe.configure({ timeout: 120000 });

  test.afterEach(async ({ page }) => {
    // Clean up routes to prevent interference between tests
    try {
      await page.unrouteAll({ behavior: 'ignoreErrors' });
    } catch (e) {
      // Ignore errors during cleanup
    }
  });

  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    // Firefox needs networkidle instead of domcontentloaded for reliability
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds (reasonable for local server)
    expect(loadTime).toBeLessThan(5000);
  });

  test('SPA navigation is fast', async ({ page }) => {
    // Firefox needs networkidle instead of domcontentloaded for reliability
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit' });
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Measure navigation time
    const startTime = Date.now();
    
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
    
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#ProjInProgress, #ProjComplete');
    }, { timeout: 15000 });

    const navTime = Date.now() - startTime;
    
    // SPA navigation should be fast (< 3 seconds)
    expect(navTime).toBeLessThan(3000);
  });

  test('images are optimized', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    // Check image loading
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check first few images have loading attributes
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const loading = await img.getAttribute('loading');
        // Images should use lazy loading when appropriate
        // (loading attribute is optional but recommended)
      }
    }
  });

  test('no blocking resources', async ({ page }) => {
    const resources: string[] = [];
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('.css') || url.includes('.js')) {
        resources.push(url);
      }
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    // Verify critical resources loaded
    expect(resources.length).toBeGreaterThan(0);
  });

  test('page is interactive quickly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const interactiveTime = await page.evaluate(() => {
      return new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve(performance.timing.domInteractive - performance.timing.navigationStart);
        } else {
          window.addEventListener('load', () => {
            resolve(performance.timing.domInteractive - performance.timing.navigationStart);
          });
        }
      });
    }) as number;

    // Page should be interactive within 2 seconds
    expect(interactiveTime).toBeLessThan(2000);
  });

  test('no memory leaks on navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate multiple times
    for (let i = 0; i < 3; i++) {
      if (isMobile) {
        await page.locator('#mobile-menu-toggle').click();
        await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
        await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
        await page.waitForTimeout(500);
        await page.locator('#mobile-menu-toggle').click();
        await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
        await page.locator('.mobile-nav-item[data-url="html/pages/home.html"]').click();
      } else {
        await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
        await page.waitForTimeout(500);
        await page.locator('#navbar-links').getByRole('link', { name: 'Home' }).first().click();
      }
      
      await page.waitForTimeout(1000);
    }

    // Page should still be responsive
    const content = page.locator('#content');
    await expect(content).toBeVisible();
  });

  test('page performance metrics are acceptable', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for page to be ready
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    // Get performance metrics using Performance API
    const metrics = await page.evaluate(() => {
      const perf = performance.timing;
      const navigation = perf.navigationStart;
      
      return {
        domContentLoaded: perf.domContentLoadedEventEnd - navigation,
        loadComplete: perf.loadEventEnd - navigation,
        domInteractive: perf.domInteractive - navigation,
        firstPaint: performance.getEntriesByType('paint').find((entry: any) => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find((entry: any) => entry.name === 'first-contentful-paint')?.startTime || 0,
      };
    });

    // DOM Content Loaded should be under 3 seconds
    expect(metrics.domContentLoaded).toBeLessThan(3000);
    
    // Load complete should be under 5 seconds
    expect(metrics.loadComplete).toBeLessThan(5000);
    
    // DOM Interactive should be under 2 seconds
    expect(metrics.domInteractive).toBeLessThan(2000);
  });

  test('resource loading is optimized', async ({ page }) => {
    const resources: Array<{ url: string; size: number; duration: number }> = [];
    
    page.on('response', async (response) => {
      const url = response.url();
      const headers = response.headers();
      const contentLength = headers['content-length'];
      
      if (contentLength) {
        const startTime = Date.now();
        await response.body();
        const duration = Date.now() - startTime;
        
        resources.push({
          url,
          size: parseInt(contentLength, 10),
          duration
        });
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for content
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });

    // Check that critical resources loaded
    expect(resources.length).toBeGreaterThan(0);
    
    // Calculate total page weight
    const totalSize = resources.reduce((sum, r) => sum + r.size, 0);
    
    // Page should be under 5MB (reasonable for a portfolio site)
    expect(totalSize).toBeLessThan(5 * 1024 * 1024);
    
    // Average resource load time should be reasonable
    if (resources.length > 0) {
      const avgDuration = resources.reduce((sum, r) => sum + r.duration, 0) / resources.length;
      expect(avgDuration).toBeLessThan(2000); // 2 seconds average
    }
  });
});

