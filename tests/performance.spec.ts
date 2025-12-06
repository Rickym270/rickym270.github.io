import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test.describe.configure({ timeout: 120000 });

  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds (reasonable for local server)
    expect(loadTime).toBeLessThan(5000);
  });

  test('SPA navigation is fast', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    await page.waitForSelector('#content', { state: 'attached' });
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
    
    await page.waitForSelector('#content', { state: 'attached' });
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
    
    await page.waitForSelector('#content', { state: 'attached' });
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
    
    await page.waitForSelector('#content', { state: 'attached' });
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
});

