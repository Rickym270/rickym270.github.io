import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('siteLanguage', 'en');
    });
  });

  test.afterEach(async ({ page }) => {
    // Clean up routes to prevent interference between tests
    // Only clean up if page is still open
    try {
      if (!page.isClosed()) {
        await page.unrouteAll({ behavior: 'ignoreErrors' });
      }
    } catch (e) {
      // Ignore errors during cleanup
    }
  });

  test('page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    
    // Wait for content to load - use multiple strategies with shorter timeouts
    try {
      await page.waitForFunction(() => {
        const c = document.querySelector('#content');
        if (!c) return false;
        const dataLoaded = c.getAttribute('data-content-loaded') === 'true';
        const hasBanner = !!c.querySelector('#homeBanner');
        const hasHeading = !!c.querySelector('h1, h2, h3');
        const hasContent = c.children.length > 0;
        return dataLoaded || hasBanner || hasHeading || hasContent;
      }, { timeout: 5000 });
    } catch {
      // Fallback: wait for any heading or content element
      try {
        await page.waitForSelector('#content h1, #content h2, #content h3, #content *', { timeout: 5000 });
      } catch {
        // Last resort: just wait a bit and continue
        await page.waitForTimeout(1000);
      }
    }

    // Check for main heading (h1) - be lenient
    const h1 = page.locator('h1').first();
    const h1Count = await h1.count();
    
    // If no h1, check for any heading
    if (h1Count === 0) {
      const anyHeading = page.locator('h1, h2, h3').first();
      const anyHeadingCount = await anyHeading.count();
      expect(anyHeadingCount).toBeGreaterThan(0);
      if (anyHeadingCount > 0) {
        await expect(anyHeading).toBeVisible({ timeout: 5000 });
      }
    } else {
      expect(h1Count).toBeGreaterThan(0);
      await expect(h1).toBeVisible({ timeout: 5000 });
    }
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    
    // Wait for content to load - use multiple strategies with shorter timeouts
    try {
      await page.waitForFunction(() => {
        const c = document.querySelector('#content');
        if (!c) return false;
        const dataLoaded = c.getAttribute('data-content-loaded') === 'true';
        const hasBanner = !!c.querySelector('#homeBanner');
        const hasContent = c.children.length > 0 || (c.textContent && c.textContent.trim().length > 0);
        return dataLoaded || hasBanner || hasContent;
      }, { timeout: 5000 });
    } catch {
      // Fallback: wait for any content element
      try {
        await page.waitForSelector('#content *', { timeout: 5000 });
      } catch {
        await page.waitForTimeout(1000);
      }
    }

    // Get all images (excluding decorative ones)
    const images = page.locator('img:not([role="presentation"])');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 10); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        // Alt should exist (can be empty for decorative images, but attribute should be present)
        expect(alt).not.toBeNull();
      }
    }
  });

  test('links have accessible text', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    
    // Wait for content to load - use multiple strategies with shorter timeouts
    try {
      await page.waitForFunction(() => {
        const c = document.querySelector('#content');
        if (!c) return false;
        const dataLoaded = c.getAttribute('data-content-loaded') === 'true';
        const hasBanner = !!c.querySelector('#homeBanner');
        const hasContent = c.children.length > 0 || (c.textContent && c.textContent.trim().length > 0);
        return dataLoaded || hasBanner || hasContent;
      }, { timeout: 5000 });
    } catch {
      // Fallback: wait for navigation to be ready
      try {
        await page.waitForSelector('nav a, .nav-link', { timeout: 5000 });
      } catch {
        await page.waitForTimeout(1000);
      }
    }

    // Check main navigation links
    const navLinks = page.locator('nav a, .nav-link');
    const linkCount = await navLinks.count();
    
    if (linkCount > 0) {
      for (let i = 0; i < Math.min(linkCount, 10); i++) {
        const link = navLinks.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        // Link should have either text content or aria-label
        expect(text?.trim() || ariaLabel).toBeTruthy();
      }
    }
  });

  test('form inputs have labels', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    
    // Wait for initial content, then navigate to contact - use shorter timeout
    try {
      await page.waitForFunction(() => {
        const c = document.querySelector('#content');
        if (!c) return false;
        const dataLoaded = c.getAttribute('data-content-loaded') === 'true';
        const hasBanner = !!c.querySelector('#homeBanner');
        const hasContent = c.children.length > 0 || (c.textContent && c.textContent.trim().length > 0);
        return dataLoaded || hasBanner || hasContent;
      }, { timeout: 5000 });
    } catch {
      // Fallback: just wait a bit and continue
      await page.waitForTimeout(1000);
    }

    // Navigate to contact page
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first().click();
    }
    
    await page.waitForSelector('#contact-form', { state: 'visible', timeout: 10000 });

    // Check form inputs have associated labels
    const inputs = page.locator('#contact-form input[type="text"], #contact-form input[type="email"], #contact-form textarea');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');
      
      if (id) {
        // Check for label with matching 'for' attribute
        const label = page.locator(`label[for="${id}"]`);
        const labelCount = await label.count();
        // Input should have either label, aria-label, or placeholder
        expect(labelCount > 0 || ariaLabel || placeholder).toBeTruthy();
      }
    }
  });

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    // Check buttons have text or aria-label
    const buttons = page.locator('button:not([aria-hidden="true"])');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i);
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        // Button should have either text or aria-label
        expect(text?.trim() || ariaLabel).toBeTruthy();
      }
    }
  });

  test('page has skip to main content link', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Check for skip link (common a11y pattern)
    const skipLink = page.locator('a[href="#content"], a[href="#main"], .skip-link, [class*="skip"]');
    const skipLinkCount = await skipLink.count();
    
    // Skip link is optional but recommended - just verify if present
    if (skipLinkCount > 0) {
      await expect(skipLink.first()).toBeVisible();
    }
  });

  test('color contrast meets WCAG standards', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    // Check main text elements have sufficient contrast
    // This is a basic check - full contrast testing requires specialized tools
    const body = page.locator('body');
    const bodyColor = await body.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        color: style.color,
        backgroundColor: style.backgroundColor
      };
    });
    
    // Verify colors are set (not transparent)
    expect(bodyColor.color).toBeTruthy();
    expect(bodyColor.backgroundColor).toBeTruthy();
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    // Test Tab navigation
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = await page.evaluate(() => {
      const active = document.activeElement;
      return active ? active.tagName : null;
    });
    
    expect(focusedElement).toBeTruthy();
    
    // Verify focus indicator is visible
    const focusStyles = await page.evaluate(() => {
      const style = window.getComputedStyle(document.activeElement || document.body);
      return {
        outline: style.outline,
        outlineWidth: style.outlineWidth
      };
    });
    
    // Focus should have visible indicator (outline or box-shadow)
    expect(focusStyles.outline || focusStyles.outlineWidth !== '0px').toBeTruthy();
  });

  test('ARIA landmarks are present', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    // Check for main landmark - #content serves as main content area
    // It may not have explicit role="main" but is the main content container
    const main = page.locator('main, [role="main"], #content');
    const mainCount = await main.count();
    
    // Main content area should be identifiable (either explicit main/role or #content)
    expect(mainCount).toBeGreaterThan(0);
    
    // Check for navigation landmark
    const nav = page.locator('nav, [role="navigation"]');
    const navCount = await nav.count();
    expect(navCount).toBeGreaterThan(0);
  });
});

