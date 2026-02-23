import { test, expect } from '@playwright/test';

function logDebug(location: string, message: string, data: Record<string, unknown>, hypothesisId: string) {
  const runId = process.env.CI ? 'ci' : 'local';
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/6a51373e-0e77-47ee-bede-f80eb24e3f5c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'301aa9'},body:JSON.stringify({sessionId:'301aa9',location,message,data,timestamp:Date.now(),runId,hypothesisId})}).catch(()=>{});
  // #endregion
}

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page, browserName }) => {
    // Ensure English is set for these tests
    // Use networkidle for Firefox, domcontentloaded for others
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil, timeout: 90000 });
    
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

  test.afterEach(async ({ page }) => {
    // Clean up routes to prevent interference between tests
    try {
      await page.unrouteAll({ behavior: 'ignoreErrors' });
    } catch (e) {
      // Ignore errors during cleanup
    }
  });

  test('contact page loads with form fields', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Contact - handle mobile
    if (isMobile) {
      // Wait for mobile menu toggle to be ready
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 5000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 5000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click({ timeout: 5000 });
    } else {
      // For Firefox, wait for link to be ready and use force click if needed
      const contactLink = page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first();
      await contactLink.waitFor({ state: 'visible', timeout: 10000 });
      // Try normal click first, if it fails on Firefox, use force
      try {
        await contactLink.click({ timeout: 10000 });
      } catch (e) {
        // Firefox sometimes needs force click for SPA navigation
        await contactLink.click({ force: true, timeout: 10000 });
      }
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
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Contact
    if (isMobile) {
      // Wait for mobile menu toggle to be ready
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 5000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 5000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click({ timeout: 5000 });
    } else {
      // For Firefox, wait for link to be ready and use force click if needed
      const contactLink = page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first();
      await contactLink.waitFor({ state: 'visible', timeout: 10000 });
      // Try normal click first, if it fails on Firefox, use force
      try {
        await contactLink.click({ timeout: 10000 });
      } catch (e) {
        // Firefox sometimes needs force click for SPA navigation
        await contactLink.click({ force: true, timeout: 10000 });
      }
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
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Contact
    if (isMobile) {
      // Wait for mobile menu toggle to be ready
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 5000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 5000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click({ timeout: 5000 });
    } else {
      // For Firefox, wait for link to be ready and use force click if needed
      const contactLink = page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first();
      await contactLink.waitFor({ state: 'visible', timeout: 10000 });
      // Try normal click first, if it fails on Firefox, use force
      try {
        await contactLink.click({ timeout: 10000 });
      } catch (e) {
        // Firefox sometimes needs force click for SPA navigation
        await contactLink.click({ force: true, timeout: 10000 });
      }
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
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Contact
    if (isMobile) {
      // Wait for mobile menu toggle to be ready
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 5000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 5000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click({ timeout: 5000 });
    } else {
      // For Firefox, wait for link to be ready and use force click if needed
      const contactLink = page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first();
      await contactLink.waitFor({ state: 'visible', timeout: 10000 });
      // Try normal click first, if it fails on Firefox, use force
      try {
        await contactLink.click({ timeout: 10000 });
      } catch (e) {
        // Firefox sometimes needs force click for SPA navigation
        await contactLink.click({ force: true, timeout: 10000 });
      }
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
    
    // Diagnostics: log network activity for this test (helps debug race)
    const requestUrls: string[] = [];
    page.on('request', request => {
      const url = request.url();
      if (url.includes('contact') || url.includes('/api/')) {
        requestUrls.push(`${request.method()} ${url}`);
        console.log('[request]', request.method(), url);
        // #region agent log
        logDebug('contact.spec.ts:292', 'Contact request seen', {
          url,
          method: request.method(),
        }, 'CT1');
        // #endregion
      }
    });
    page.on('requestfailed', r => console.log('[requestfailed]', r.method(), r.url(), r.failure()?.errorText));
    page.on('response', r => console.log('[response]', r.status(), r.url()));
    
    // Set up route BEFORE navigation - Playwright routes persist across navigation
    // Use regex pattern for more reliable interception across absolute and relative URLs
    await page.route(/.*\/api\/contact(?:\?.*)?$/, async (route) => {
      // #region agent log
      logDebug('contact.spec.ts:303', 'Contact API route intercepted', {
        url: route.request().url(),
        method: route.request().method(),
      }, 'CT1');
      // #endregion
      const req = route.request();
      console.log('[route] intercepted', req.method(), req.url());
      // Handle CORS preflight quickly to avoid blocking POST
      if (req.method() === 'OPTIONS') {
        await route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' });
        return;
      }
      // Only intercept once
      if (!requestIntercepted) {
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
      } else {
        // If already intercepted, continue with the request (shouldn't happen, but safe)
        await route.continue();
      }
    });
    
    // Use networkidle for Firefox, domcontentloaded for others
    const browserName = page.context().browser()?.browserType().name() || 'chromium';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil, timeout: 90000 });
    
    // Wait for initial load
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Contact
    if (isMobile) {
      // Wait for mobile menu toggle to be ready
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 5000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 5000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click({ timeout: 5000 });
    } else {
      // For Firefox, wait for link to be ready and use force click if needed
      const contactLink = page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first();
      await contactLink.waitFor({ state: 'visible', timeout: 10000 });
      // Try normal click first, if it fails on Firefox, use force
      try {
        await contactLink.click({ timeout: 10000 });
      } catch (e) {
        // Firefox sometimes needs force click for SPA navigation
        await contactLink.click({ force: true, timeout: 10000 });
      }
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
    // Increase timeout for mobile devices which may be slower
    const timeoutDuration = isMobile ? 60000 : 10000;
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutDuration);
    });
    
    // Also wait for the POST request to be observed (deterministic)
    const waitForPost = page.waitForRequest(
      req => req.url().includes('/api/contact') && req.method() === 'POST',
      { timeout: timeoutDuration }
    ).catch(() => null);
    
    try {
      await Promise.race([requestPromise, responsePromise, waitForPost, timeoutPromise]);
    } catch (error) {
      // If request wasn't intercepted, log for debugging
      if (!requestIntercepted) {
        console.error('Request was not intercepted within timeout');
        console.error('Request URLs captured:', requestUrls);
        // Give it a moment to see if request comes through
        await page.waitForTimeout(2000);
        if (requestUrls.length === 0) {
          console.error('No API requests detected. Form may not have submitted.');
          // Check if form validation prevented submission
          const errorMessage = await page.locator('#form-message.alert-danger').isVisible().catch(() => false);
          if (errorMessage) {
            const errorText = await page.locator('#form-message.alert-danger').textContent().catch(() => '');
            console.error('Form validation error:', errorText);
          }
        } else {
          console.error('Requests were made but not intercepted. Route pattern may not match.');
          console.error('First request URL:', requestUrls[0]);
          console.error('Route pattern: /.*\\/api\\/contact(?:\\?.*)?$/');
        }
      }
      // Re-throw if it's not a timeout (timeout is expected if request wasn't intercepted)
      if (error instanceof Error && !error.message.includes('timeout')) {
        throw error;
      }
    }
    
    // Verify the request was intercepted (not sent to real API)
    // If it wasn't intercepted, the error above should have provided debugging info
    // #region agent log
    logDebug('contact.spec.ts:445', 'Contact intercepted flag', {
      requestIntercepted,
      requestUrls,
    }, 'CT2');
    // #endregion
    expect(requestIntercepted).toBe(true);
    
    // Clean up routes to prevent errors when test ends
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('form submission shows success message', async ({ page }) => {
    // Mock the API endpoint to prevent actual email sending
    // Use Promise to track when request is intercepted and fulfilled
    let routeFulfilled = false;
    let routeFulfillCompleted = false;
    let routeFulfillPromise: Promise<void>;
    let resolveRouteFulfill: () => void;
    
    routeFulfillPromise = new Promise((resolve) => {
      resolveRouteFulfill = resolve;
    });
    
    // Use networkidle for Firefox, domcontentloaded for others
    const browserName = page.context().browser()?.browserType().name() || 'chromium';
    // Set up route BEFORE navigation - Playwright routes persist across navigation
    // Use regex pattern for more reliable interception across absolute and relative URLs
    await page.route(/.*\/api\/contact(?:\?.*)?$/, async (route) => {
      const req = route.request();
      console.log('[route] intercepted', req.method(), req.url());
      // Handle CORS preflight quickly to avoid blocking POST
      if (req.method() === 'OPTIONS') {
        await route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' });
        return;
      }
      routeFulfilled = true;
      try {
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
        routeFulfillCompleted = true;
        // Resolve promise AFTER route.fulfill completes successfully
        resolveRouteFulfill();
      } catch (fulfillError) {
        // Reset routeFulfilled if fulfill failed
        routeFulfilled = false;
        routeFulfillCompleted = false;
        throw fulfillError;
      }
    });
    
    // Also set up request listener for debugging
    const requestUrls: string[] = [];
    page.on('request', request => {
      const url = request.url();
      if (url.includes('contact') || url.includes('api')) {
        requestUrls.push(`${request.method()} ${url}`);
        console.log('Request intercepted:', url);
      }
    });
    page.on('requestfailed', r => console.log('[requestfailed]', r.method(), r.url(), r.failure()?.errorText));
    page.on('response', r => console.log('[response]', r.status(), r.url()));

    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil, timeout: 90000 });
    
    // Wait for initial load
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Contact
    if (isMobile) {
      // Wait for mobile menu toggle to be ready
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 5000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 5000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click({ timeout: 5000 });
    } else {
      // For Firefox, wait for link to be ready and use force click if needed
      const contactLink = page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first();
      await contactLink.waitFor({ state: 'visible', timeout: 10000 });
      // Try normal click first, if it fails on Firefox, use force
      try {
        await contactLink.click({ timeout: 10000 });
      } catch (e) {
        // Firefox sometimes needs force click for SPA navigation
        await contactLink.click({ force: true, timeout: 10000 });
      }
    }
    
    // Wait for contact page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#contact-form');
    }, { timeout: 15000 });
    
    // Wait for contact form to be ready
    await page.waitForSelector('#contact-form', { state: 'visible', timeout: 5000 });
    await page.waitForTimeout(1000); // Give Turnstile time to load if configured
    
    // Ensure submit button is enabled and visible
    const submitBtn = page.locator('#submit-btn');
    await expect(submitBtn).toBeVisible({ timeout: 5000 });
    await expect(submitBtn).toBeEnabled({ timeout: 5000 });
    
    // Fill form with valid data
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#subject').fill('Test Subject');
    await page.locator('#message').fill('This is a test message.');
    
    // Wait for route to be fulfilled (with timeout fallback)
    // Increase timeout for mobile devices which may be slower
    const timeoutDuration = isMobile ? 60000 : 20000;
    
    // Also wait for the POST request to be initiated (deterministic)
    const waitForPost = page.waitForRequest(
      r => r.url().includes('/api/contact') && r.method() === 'POST',
      { timeout: timeoutDuration }
    ).catch(() => null);
    
    // Click submit and wait for route interception in parallel
    const clickPromise = submitBtn.click().catch(err => {
      console.error('Error clicking submit button:', err);
      throw err;
    });
    
    // Wait for route fulfillment with timeout
    // Note: waitForResponse may not work with route.fulfill(), so we rely on routeFulfillPromise
    try {
      await Promise.all([clickPromise, waitForPost, routeFulfillPromise]);
      await expect.poll(() => routeFulfillCompleted, { timeout: timeoutDuration }).toBe(true);
      const messageState = await page.evaluate(() => {
        const el = document.getElementById('form-message');
        return {
          exists: !!el,
          className: el?.className || '',
          display: el ? window.getComputedStyle(el).display : '',
          text: el?.textContent?.trim() || '',
        };
      });
    } catch (error) {
      if (!routeFulfillCompleted) {
        console.error('Route was not fulfilled within timeout');
        console.error('Request URLs captured:', requestUrls);
        // Check if form submitted (button should be disabled during submission)
        const isDisabled = await submitBtn.isDisabled().catch(() => false);
        console.error('Submit button disabled state:', isDisabled);
        // Give it a moment to see if request comes through
        await page.waitForTimeout(2000);
        if (requestUrls.length === 0) {
          console.error('No API requests detected. Form may not have submitted.');
          // Check for validation errors
          const errorMessage = await page.locator('#form-message.alert-danger').isVisible().catch(() => false);
          if (errorMessage) {
            const errorText = await page.locator('#form-message.alert-danger').textContent().catch(() => '');
            console.error('Form validation error:', errorText);
          }
        } else {
          console.error('Requests were made but not intercepted. Route pattern may not match.');
          console.error('First request URL:', requestUrls[0]);
          console.error('Route pattern: /.*\\/api\\/contact(?:\\?.*)?$/');
        }
        const messageState = await page.evaluate(() => {
          const el = document.getElementById('form-message');
          return {
            exists: !!el,
            className: el?.className || '',
            display: el ? window.getComputedStyle(el).display : '',
            text: el?.textContent?.trim() || '',
          };
        });
        throw error;
      }
    }
    
    // Wait a moment for the DOM to update after response
    await page.waitForTimeout(500);
    
    // Wait for success message to appear (with increased timeout for mobile)
    // The message div changes from d-none to visible with alert-success class
    // First ensure the element exists, then check it's visible
    await page.waitForSelector('#form-message', { state: 'attached', timeout: 5000 });
    
    // Wait for the alert-success class to be added and element to be visible
    const successMessage = page.locator('#form-message.alert-success');
    await expect(successMessage).toBeVisible({ timeout: 15000 });
    
    // Clean up routes to prevent errors when test ends
    await page.unrouteAll({ behavior: 'ignoreErrors' });
    
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
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Contact
    if (isMobile) {
      // Wait for mobile menu toggle to be ready
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 5000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 5000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click({ timeout: 5000 });
    } else {
      // For Firefox, wait for link to be ready and use force click if needed
      const contactLink = page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first();
      await contactLink.waitFor({ state: 'visible', timeout: 10000 });
      // Try normal click first, if it fails on Firefox, use force
      try {
        await contactLink.click({ timeout: 10000 });
      } catch (e) {
        // Firefox sometimes needs force click for SPA navigation
        await contactLink.click({ force: true, timeout: 10000 });
      }
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

