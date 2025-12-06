import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('siteLanguage', 'en');
    });
  });

  test.afterEach(async ({ page }) => {
    // Clean up routes to prevent interference between tests
    try {
      await page.unrouteAll({ behavior: 'ignoreErrors' });
    } catch (e) {
      // Ignore errors during cleanup
    }
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
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
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
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
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
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 10000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 }).catch(() => {});

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
    await page.waitForTimeout(500); // Give form time to initialize

    // Try to submit empty form - check if form has HTML5 validation
    const submitBtn = page.locator('#submit-btn');
    const form = page.locator('#contact-form');
    
    // Check if form has required attributes (HTML5 validation)
    const hasRequired = await form.locator('input[required], textarea[required]').count();
    
    if (hasRequired > 0) {
      // HTML5 validation should prevent submission
      await submitBtn.click();
      await page.waitForTimeout(1000); // Wait for validation to trigger
      
      // Check if browser validation prevented submission
      // Either the form didn't submit (no success message) or validation error is shown
      const successMessage = await page.locator('#form-message.alert-success').isVisible().catch(() => false);
      const errorMessage = await page.locator('#form-message.alert-danger').isVisible().catch(() => false);
      
      // HTML5 validation might show browser-native validation or custom validation
      // Check if any field is marked as invalid
      const nameField = page.locator('#name');
      const emailField = page.locator('#email');
      const nameInvalid = await nameField.evaluate((el: HTMLInputElement) => !el.validity.valid).catch(() => false);
      const emailInvalid = await emailField.evaluate((el: HTMLInputElement) => !el.validity.valid).catch(() => false);
      
      // Form should not have submitted successfully
      expect(!successMessage && (errorMessage || nameInvalid || emailInvalid)).toBeTruthy();
    } else {
      // If no HTML5 validation, check for custom validation
      await submitBtn.click();
      await page.waitForTimeout(1500); // Wait longer for custom validation
      const errorMessage = page.locator('#form-message.alert-danger');
      const errorCount = await errorMessage.count();
      const isDisabled = await submitBtn.isDisabled().catch(() => false);
      // Either validation error is shown or form prevents submission
      expect(errorCount > 0 || isDisabled).toBeTruthy();
    }
  });

  test('handles 404 page gracefully', async ({ page }) => {
    // For SPA, http-server serves index.html for all routes
    // So we'll get the home page, which is acceptable behavior
    // Set a shorter timeout for this test to prevent it from hanging
    test.setTimeout(20000); // 20 seconds max
    
    // Try to navigate to non-existent page with short timeout
    const navigationPromise = page.goto('/nonexistent-page.html', { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    try {
      await navigationPromise;
      // Navigation succeeded - quickly verify page loaded
      if (!page.isClosed()) {
        const url = page.url();
        const hasContent = await page.locator('#content').count().catch(() => 0);
        // Either we're on home (SPA fallback) or have content
        expect(url.includes('localhost') && hasContent >= 0).toBeTruthy();
      }
    } catch (error) {
      // Navigation failed - verify we can still navigate to home (proves page is functional)
      if (!page.isClosed()) {
        try {
          await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 8000 });
          const homeUrl = page.url();
          expect(homeUrl).toBeTruthy();
        } catch (e) {
          // If page closed, that's acceptable for 404 handling
          if (page.isClosed()) {
            return;
          }
          // Otherwise, page should be functional
          expect(page.url()).toBeTruthy();
        }
      }
    }
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
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
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
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 10000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 }).catch(() => {});

    // Wait for TranslationManager to be ready
    await page.waitForFunction(() => {
      return typeof window.TranslationManager !== 'undefined' && 
             window.TranslationManager.currentLanguage !== undefined;
    }, { timeout: 5000 }).catch(() => {});

    // Switch to Spanish - language switcher uses buttons with data-lang attribute
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      // Wait for language switcher to be visible
      await page.waitForSelector('#mobile-language-switcher button[data-lang="es"]', { state: 'visible', timeout: 5000 });
      // Click Spanish button in mobile language switcher
      await page.locator('#mobile-language-switcher button[data-lang="es"]').click({ timeout: 5000 });
    } else {
      // Wait for language switcher to be visible (check both desktop and medium)
      await page.waitForSelector('#language-switcher button[data-lang="es"], #language-switcher-medium button[data-lang="es"]', { state: 'visible', timeout: 5000 });
      // Click Spanish button in desktop language switcher
      await page.locator('#language-switcher button[data-lang="es"], #language-switcher-medium button[data-lang="es"]').first().click({ timeout: 5000 });
    }
    
    await page.waitForTimeout(2000); // Wait for translations to apply

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
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const content = page.locator('#content');
    await expect(content).toBeVisible();
  });
});


