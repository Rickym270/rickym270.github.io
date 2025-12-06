import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('siteLanguage', 'en');
    });
  });

  test('handles API failure gracefully on projects page', async ({ page }) => {
    // Intercept API calls and return error
    await page.route('**/api/projects', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    // Navigate to projects
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
    
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#ProjInProgress, .alert');
    }, { timeout: 15000 });

    // Should show error message or fallback content
    const errorMessage = page.locator('.alert, .alert-warning, .alert-danger');
    const errorCount = await errorMessage.count();
    
    // Either error message is shown or static content is displayed
    const hasContent = await page.locator('#ProjInProgress, #ProjComplete').count();
    expect(errorCount > 0 || hasContent > 0).toBeTruthy();
  });

  test('handles network timeout gracefully', async ({ page }) => {
    // Simulate slow network
    await page.route('**/api/projects', async (route) => {
      // Delay response to simulate timeout
      await new Promise(resolve => setTimeout(resolve, 10000));
      await route.abort();
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    // Navigate to projects
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
    
    // Wait for either error or content
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || 
             !!c?.querySelector('#ProjInProgress, .alert, .alert-warning');
    }, { timeout: 20000 });

    // Page should still be functional
    const content = page.locator('#content');
    await expect(content).toBeVisible();
  });

  test('handles invalid form submission', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    // Navigate to contact
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first().click();
    }
    
    await page.waitForSelector('#contact-form', { state: 'visible', timeout: 10000 });

    // Try to submit empty form
    const submitBtn = page.locator('#submit-btn');
    await submitBtn.click();
    
    // Should show validation error
    await page.waitForTimeout(1000);
    const errorMessage = page.locator('#form-message.alert-danger, .alert-danger');
    const errorCount = await errorMessage.count();
    
    // Either validation error is shown or form prevents submission
    const isDisabled = await submitBtn.isDisabled().catch(() => false);
    expect(errorCount > 0 || isDisabled).toBeTruthy();
  });

  test('handles 404 page gracefully', async ({ page }) => {
    await page.goto('/nonexistent-page.html', { waitUntil: 'domcontentloaded' });
    
    // Should either show 404 page or redirect to home
    const url = page.url();
    const has404 = await page.locator('h1, h2').filter({ hasText: /404|not found|page not found/i }).count();
    const isHome = url.includes('index.html') || url.endsWith('/');
    
    // Either 404 page is shown or redirected to home
    expect(has404 > 0 || isHome).toBeTruthy();
  });

  test('handles JavaScript errors without breaking page', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    // Page should still be functional despite any console errors
    const content = page.locator('#content');
    await expect(content).toBeVisible();
    
    // Navigation should still work
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (!isMobile) {
      const projectsLink = page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first();
      await expect(projectsLink).toBeVisible();
    }
  });

  test('handles missing translation keys gracefully', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    // Switch to Spanish
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('#mobile-language-toggle').click();
    } else {
      await page.locator('#language-toggle').click();
    }
    
    await page.waitForTimeout(1000);

    // Page should still render (missing keys should show key or fallback)
    const content = page.locator('#content');
    await expect(content).toBeVisible();
    
    // Navigation should still work
    const navLinks = page.locator('nav a, .nav-link');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('handles localStorage errors gracefully', async ({ page }) => {
    // Block localStorage
    await page.addInitScript(() => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function() {
        throw new Error('QuotaExceededError');
      };
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Page should still load and function
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const content = page.locator('#content');
    await expect(content).toBeVisible();
  });
});

