import { test, expect } from '@playwright/test';

test.describe('SPA Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure English is set for these tests
    await page.goto('/');
    
    // Wait for TranslationManager to be available and initialized
    await page.waitForFunction(() => {
      return typeof window.TranslationManager !== 'undefined' && 
             window.TranslationManager.currentLanguage !== undefined;
    }, { timeout: 5000 }).catch(() => {
      // TranslationManager might not exist on master branch - that's okay
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
    
    // Verify English is set by checking navbar text
    await page.waitForFunction(() => {
      const homeLink = document.querySelector('nav a[data-translate="nav.home"]');
      return homeLink && homeLink.textContent?.trim() === 'Home';
    }, { timeout: 3000 }).catch(() => {
      // If translation system doesn't exist, that's okay - tests will use English by default
    });
  });

  test('navigation loads content into #content without full page reload', async ({ page }) => {
    await page.goto('/');
    
    // Initial page load - wait for content
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    const initialUrl = page.url();
    await expect(page.locator('#content')).toBeVisible();
    
    // Navigate to Projects - use navbar scoped selector to avoid mobile sidebar duplicates
    await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    
    // Wait for projects page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!document.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    
    // Wait for translations to apply
    await page.waitForTimeout(500);
    
    // URL should not change
    expect(page.url()).toBe(initialUrl);
    
    // Navbar should remain visible
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Content should have changed
    const projectsHeading = page.locator('#content h1[data-translate="projects.heading"]');
    await expect(projectsHeading).toBeVisible({ timeout: 5000 });
    await expect(projectsHeading).toHaveText('Projects', { timeout: 3000 });
  });

  test('theme persists across SPA navigation', async ({ page }) => {
    await page.goto('/');
    
    // Set theme to dark
    const themeToggle = page.locator('#theme-toggle');
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    const themeBefore = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    
    // Navigate to different pages - use navbar scoped selector
    await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    await page.waitForTimeout(1000);
    
    let themeAfter = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    expect(themeAfter).toBe(themeBefore);
    
    // Use navbar link specifically to avoid ambiguity with "View All Skills" button
    await page.locator('nav.navbar a[data-translate="nav.skills"]').click();
    await page.waitForTimeout(1000);
    
    themeAfter = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    expect(themeAfter).toBe(themeBefore);
  });

  test('tutorials page does not reload entire page when clicked', async ({ page }) => {
    await page.goto('/');
    
    const initialUrl = page.url();
    
    // Click Tutorials - use navbar scoped selector to avoid mobile sidebar duplicates
    await page.locator('#navbar-links').getByRole('link', { name: 'Tutorials' }).first().click();
    
    // Wait for content to load - use waitForFunction for better reliability
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('h1[data-translate="tutorials.heading"]');
    }, { timeout: 15000 });
    
    // URL should not change
    expect(page.url()).toBe(initialUrl);
    
    // Navbar should still be visible
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Wait for heading element to exist in DOM first - use data-translate attribute for reliable selection
    await page.waitForSelector('#content h1[data-translate="tutorials.heading"]', { timeout: 15000, state: 'attached' });
    await page.waitForTimeout(500);
    
    // Tutorials content should load - use data-translate attribute for reliable selection
    const tutorialsHeading = page.locator('#content h1[data-translate="tutorials.heading"]');
    await expect(tutorialsHeading).toBeVisible({ timeout: 10000 });
    await expect(tutorialsHeading).toHaveText('Tutorials', { timeout: 5000 });
  });

  test('content does not duplicate on multiple navigations', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForTimeout(500);
    
    // Navigate to Projects multiple times - use navbar scoped selector
    for (let i = 0; i < 3; i++) {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
      
      // Wait for projects page to load
      await page.waitForFunction(() => {
        const c = document.querySelector('#content');
        return c?.getAttribute('data-content-loaded') === 'true' || !!document.querySelector('#ProjInProgress .row, #ProjComplete .row');
      }, { timeout: 15000 });
      
      // Wait for heading to exist first, then check visibility
      await page.waitForSelector('#content h1[data-translate="projects.heading"]', { timeout: 15000, state: 'attached' });
      await page.waitForTimeout(500);
      
      // Verify heading is visible
      const projectsHeading = page.locator('#content h1[data-translate="projects.heading"]');
      await expect(projectsHeading).toBeVisible({ timeout: 10000 });
      
      // Should only have one Projects heading (use data-translate attribute for reliable selection)
      const projectsHeadings = page.locator('#content h1[data-translate="projects.heading"]');
      const count = await projectsHeadings.count();
      expect(count).toBe(1);
    }
  });
});

