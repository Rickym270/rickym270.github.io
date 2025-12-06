import { test, expect } from '@playwright/test';

test.describe('SPA Navigation', () => {
  // Set timeout for all tests in this describe block
  test.describe.configure({ timeout: 120000 }); // 2 minutes
  
  test.beforeEach(async ({ page }) => {
    // Minimal setup - just set language preference (no page load)
    // Tests will load the page themselves, avoiding double loads
    await page.addInitScript(() => {
      localStorage.setItem('siteLanguage', 'en');
    });
  });

  test('navigation loads content into #content without full page reload', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    // Initial page load - wait for content
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    const initialUrl = page.url();
    await expect(page.locator('#content')).toBeVisible();
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Projects - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
    
    // Wait for projects page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!document.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    
    // Wait for heading element - use fallback pattern for WebKit
    try {
      await page.waitForSelector('#content h1[data-translate="projects.heading"]', { timeout: 15000, state: 'visible' });
    } catch {
      // Fallback for WebKit - wait for any heading with Projects text and check visibility
      await page.waitForFunction(() => {
        const heading = document.querySelector('#content h1') as HTMLElement;
        return heading && heading.textContent?.includes('Projects') && heading.offsetParent !== null;
      }, { timeout: 10000 });
    }
    await page.waitForTimeout(500);
    
    // URL should not change
    expect(page.url()).toBe(initialUrl);
    
    // Navbar should remain visible
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Content should have changed - use fallback selector for WebKit
    const projectsHeading = page.locator('#content h1[data-translate="projects.heading"], #content h1').filter({ hasText: /Projects/i });
    const projectsHeadingCount = await projectsHeading.count();
    if (projectsHeadingCount > 0) {
      await expect(projectsHeading.first()).toBeVisible({ timeout: 5000 });
      await expect(projectsHeading.first()).toHaveText('Projects', { timeout: 3000 });
    } else {
      // Final fallback - check for any heading
      const anyHeading = page.locator('#content h1');
      const anyHeadingCount = await anyHeading.count();
      if (anyHeadingCount > 0) {
        await expect(anyHeading.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('theme persists across SPA navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Set theme to dark - handle mobile
    let themeToggle;
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      themeToggle = page.locator('#mobile-theme-toggle');
    } else {
      themeToggle = page.locator('#theme-toggle');
    }
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    const themeBefore = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    
    // Navigate to different pages - handle mobile
    if (isMobile) {
      // Sidebar should still be open
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
    await page.waitForTimeout(1000);
    
    let themeAfter = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    expect(themeAfter).toBe(themeBefore);
    
    // Navigate to Skills - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/skills.html"]').click();
    } else {
      await page.locator('#navbar-links a[data-translate="nav.skills"]').first().click();
    }
    await page.waitForTimeout(1000);
    
    themeAfter = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    expect(themeAfter).toBe(themeBefore);
  });

  test('tutorials page does not reload entire page when clicked', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    const initialUrl = page.url();
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Click Tutorials - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/tutorials.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Tutorials' }).first().click();
    }
    
    // Wait for content to load - use waitForFunction for better reliability
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('h1[data-translate="tutorials.heading"]');
    }, { timeout: 15000 });
    
    // URL should not change
    expect(page.url()).toBe(initialUrl);
    
    // Navbar should still be visible
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Wait for heading element - use fallback pattern for WebKit
    try {
      await page.waitForSelector('#content h1[data-translate="tutorials.heading"]', { timeout: 15000, state: 'visible' });
    } catch {
      // Fallback for WebKit - wait for any heading with Tutorials text and check visibility
      await page.waitForFunction(() => {
        const heading = document.querySelector('#content h1') as HTMLElement;
        return heading && heading.textContent?.includes('Tutorials') && heading.offsetParent !== null;
      }, { timeout: 10000 });
    }
    await page.waitForTimeout(500);
    
    // Tutorials content should load - use fallback selector for WebKit
    const tutorialsHeading = page.locator('#content h1[data-translate="tutorials.heading"], #content h1').filter({ hasText: /Tutorials/i });
    const tutorialsHeadingCount = await tutorialsHeading.count();
    if (tutorialsHeadingCount > 0) {
      await expect(tutorialsHeading.first()).toBeVisible({ timeout: 10000 });
      await expect(tutorialsHeading.first()).toHaveText('Tutorials', { timeout: 5000 });
    } else {
      // Final fallback - check for any heading
      const anyHeading = page.locator('#content h1');
      const anyHeadingCount = await anyHeading.count();
      if (anyHeadingCount > 0) {
        await expect(anyHeading.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('content does not duplicate on multiple navigations', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    // Wait for initial load
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Projects multiple times - handle mobile
    for (let i = 0; i < 3; i++) {
      if (isMobile) {
        await page.locator('#mobile-menu-toggle').click();
        await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
        await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
      } else {
        await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
      }
      
      // Wait for projects page to load
      await page.waitForFunction(() => {
        const c = document.querySelector('#content');
        return c?.getAttribute('data-content-loaded') === 'true' || !!document.querySelector('#ProjInProgress .row, #ProjComplete .row');
      }, { timeout: 15000 });
      
      // Wait for heading to exist first, then check visibility
      try {
        await page.waitForSelector('#content h1[data-translate="projects.heading"]', { timeout: 15000, state: 'visible' });
      } catch {
        // Fallback for WebKit: wait for any h1 with Projects text
        await page.waitForFunction(() => {
          const heading = document.querySelector('#content h1') as HTMLElement | null;
          return heading && heading.textContent?.includes('Projects') && heading.offsetParent !== null;
        }, { timeout: 10000 });
      }
      await page.waitForTimeout(500);
      
      // Verify heading is visible - use fallback selector for WebKit
      const projectsHeading = page.locator('#content h1[data-translate="projects.heading"], #content h1').filter({ hasText: /Projects/i });
      await expect(projectsHeading.first()).toBeVisible({ timeout: 10000 });
      
      // Should only have one Projects heading (use data-translate attribute for reliable selection)
      const projectsHeadings = page.locator('#content h1[data-translate="projects.heading"]');
      const count = await projectsHeadings.count();
      expect(count).toBe(1);
    }
  });
});

