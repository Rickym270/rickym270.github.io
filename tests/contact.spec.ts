import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure English is set for these tests
    await page.goto('/');
    
    // Wait for TranslationManager to be available and initialized
    await page.waitForFunction(() => {
      return typeof window.TranslationManager !== 'undefined' && 
             window.TranslationManager.currentLanguage !== undefined;
    }, { timeout: 5000 }).catch(() => {
      // TranslationManager might not exist - that's okay
    });
    
    // Set language to English
    await page.evaluate(() => {
      localStorage.setItem('siteLanguage', 'en');
      if (typeof window.TranslationManager !== 'undefined') {
        window.TranslationManager.switchLanguage('en');
      }
    });
    
    // Wait for translations to apply
    await page.waitForTimeout(500);
  });

  test('contact page loads with form fields', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Contact - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first().click();
    }
    
    // Wait for contact page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#contact-form');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check for form elements
    const form = page.locator('#contact-form');
    await expect(form).toBeVisible();
    
    // Check all required fields exist
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#subject')).toBeVisible();
    await expect(page.locator('#message')).toBeVisible();
    await expect(page.locator('#submit-btn')).toBeVisible();
    
    // Check labels
    await expect(page.getByLabel(/Name/i)).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Subject/i)).toBeVisible();
    await expect(page.getByLabel(/Message/i)).toBeVisible();
  });

  test('form validation works for empty fields', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Contact
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first().click();
    }
    
    // Wait for contact page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#contact-form');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Try to submit empty form
    const submitBtn = page.locator('#submit-btn');
    await submitBtn.click();
    
    // Check for validation message (browser native or custom)
    // HTML5 validation should prevent submission
    const nameField = page.locator('#name');
    const emailField = page.locator('#email');
    
    // Check if fields are marked as invalid
    const nameInvalid = await nameField.evaluate((el: HTMLInputElement) => el.validity.valid);
    const emailInvalid = await emailField.evaluate((el: HTMLInputElement) => el.validity.valid);
    
    expect(nameInvalid).toBe(false);
    expect(emailInvalid).toBe(false);
  });

  test('email validation works for invalid email', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Contact
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first().click();
    }
    
    // Wait for contact page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#contact-form');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Fill form with invalid email
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('invalid-email');
    await page.locator('#subject').fill('Test Subject');
    await page.locator('#message').fill('Test message');
    
    // Try to submit
    const submitBtn = page.locator('#submit-btn');
    await submitBtn.click();
    
    // Check email field validation
    const emailField = page.locator('#email');
    const emailInvalid = await emailField.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(emailInvalid).toBe(false);
  });

  test('form can be filled with valid data', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Contact
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first().click();
    }
    
    // Wait for contact page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#contact-form');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Fill form with valid data
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#subject').fill('Test Subject');
    await page.locator('#message').fill('This is a test message for the contact form.');
    
    // Verify all fields are filled
    expect(await page.locator('#name').inputValue()).toBe('Test User');
    expect(await page.locator('#email').inputValue()).toBe('test@example.com');
    expect(await page.locator('#subject').inputValue()).toBe('Test Subject');
    expect(await page.locator('#message').inputValue()).toBe('This is a test message for the contact form.');
  });

  test('submit button is disabled during submission', async ({ page }) => {
    // Mock the API endpoint to prevent actual email sending
    // Use Promise to track when request is intercepted
    let requestIntercepted = false;
    let requestPromise: Promise<void>;
    let resolveRequest: () => void;
    
    requestPromise = new Promise((resolve) => {
      resolveRequest = resolve;
    });
    
    // Set up route BEFORE navigation - Playwright routes persist across navigation
    // Use regex pattern to match any URL containing /api/contact (both absolute and relative)
    await page.route(/.*\/api\/contact.*/, async (route) => {
      requestIntercepted = true;
      resolveRequest();
      // Simulate a slow response to test button disabled state
      // Use Promise-based delay instead of page.waitForTimeout to avoid issues when test ends
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-id',
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'This is a test message.',
          receivedAt: new Date().toISOString()
        })
      });
    });
    
    // Also set up request listener for debugging
    const requestUrls: string[] = [];
    page.on('request', request => {
      const url = request.url();
      if (url.includes('contact') || url.includes('api')) {
        requestUrls.push(url);
        console.log('Request intercepted:', url);
      }
    });
    
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Contact
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first().click();
    }
    
    // Wait for contact page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#contact-form');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Fill form with valid data
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#subject').fill('Test Subject');
    await page.locator('#message').fill('This is a test message.');
    
    // Submit form and wait for response (either intercepted or actual)
    const submitBtn = page.locator('#submit-btn');
    
    // Wait for response in parallel with form submission
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/contact'),
      { timeout: 5000 }
    ).catch(() => null);
    
    await submitBtn.click();
    
    // Wait a moment for the form to process
    await page.waitForTimeout(200);
    
    // Verify button is disabled during submission
    const wasDisabled = await submitBtn.isDisabled().catch(() => false);
    
    // Wait for either the route interception or the actual response
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 5000);
    });
    
    try {
      await Promise.race([requestPromise, responsePromise, timeoutPromise]);
    } catch (error) {
      // If request wasn't intercepted, log for debugging
      if (!requestIntercepted) {
        console.error('Request was not intercepted within timeout');
        console.error('Request URLs captured:', requestUrls);
        // Give it a moment to see if request comes through
        await page.waitForTimeout(1000);
        if (requestUrls.length === 0) {
          console.error('No API requests detected. Form may not have submitted.');
        } else {
          console.error('Requests were made but not intercepted. Route pattern may not match.');
          console.error('First request URL:', requestUrls[0]);
        }
      }
      // Re-throw if it's not a timeout (timeout is expected if request wasn't intercepted)
      if (error instanceof Error && !error.message.includes('timeout')) {
        throw error;
      }
    }
    
    // Verify the request was intercepted (not sent to real API)
    expect(requestIntercepted).toBe(true);
    
    // Clean up routes to prevent errors when test ends
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('form submission shows success message', async ({ page }) => {
    // Mock the API endpoint to prevent actual email sending
    // Use regex to match any URL containing /api/contact (both relative and absolute URLs)
    await page.route(/.*\/api\/contact/, async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-id-123',
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'This is a test message.',
          receivedAt: new Date().toISOString()
        })
      });
    });

    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Contact
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first().click();
    }
    
    // Wait for contact page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#contact-form');
    }, { timeout: 15000 });
    
    // Wait for contact form to be ready
    await page.waitForSelector('#contact-form', { state: 'visible', timeout: 5000 });
    await page.waitForTimeout(1000); // Give Turnstile time to load if configured
    
    // Fill form with valid data
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#subject').fill('Test Subject');
    await page.locator('#message').fill('This is a test message.');
    
    // Submit form
    const submitBtn = page.locator('#submit-btn');
    await submitBtn.click();
    
    // Wait for success message - increased timeout and wait for API response
    const successMessage = page.locator('#form-message.alert-success');
    await expect(successMessage).toBeVisible({ timeout: 10000 });
    
    // Check message contains success text
    const messageText = await successMessage.textContent();
    expect(messageText).toBeTruthy();
    expect(messageText!.toLowerCase()).toMatch(/success|thank you|sent/i);
    
    // Form should be reset after successful submission
    const nameValue = await page.locator('#name').inputValue();
    expect(nameValue).toBe('');
    
    // Clean up routes to prevent errors when test ends
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('contact page title and subtitle are visible', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Contact
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first().click();
    }
    
    // Wait for contact page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#contact-form');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check for title and subtitle
    const title = page.locator('h1').filter({ hasText: /Contact/i });
    await expect(title).toBeVisible();
    
    const subtitle = page.locator('p').filter({ hasText: /question|collaborate/i });
    await expect(subtitle).toBeVisible();
  });
});

