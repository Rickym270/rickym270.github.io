import { test, expect } from '@playwright/test';

test.describe('SPA Navigation', () => {
  test('navigation loads content into #content without full page reload', async ({ page }) => {
    await page.goto('/');
    
    // Initial page load - wait for content
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForTimeout(500);
    const initialUrl = page.url();
    await expect(page.locator('#content')).toBeVisible();
    
    // Navigate to Projects
    await page.getByRole('link', { name: 'Projects' }).click();
    await page.waitForTimeout(1500);
    
    // URL should not change
    expect(page.url()).toBe(initialUrl);
    
    // Navbar should remain visible
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Content should have changed
    const projectsHeading = page.locator('#content h1, #content h3').filter({ hasText: /^Projects$/ });
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
    
    // Navigate to different pages
    await page.getByRole('link', { name: 'Projects' }).click();
    await page.waitForTimeout(1000);
    
    let themeAfter = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    expect(themeAfter).toBe(themeBefore);
    
    await page.getByRole('link', { name: 'Skills' }).click();
    await page.waitForTimeout(1000);
    
    themeAfter = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    expect(themeAfter).toBe(themeBefore);
  });

  test('tutorials page does not reload entire page when clicked', async ({ page }) => {
    await page.goto('/');
    
    const initialUrl = page.url();
    
    // Click Tutorials
    await page.getByRole('link', { name: 'Tutorials' }).click();
    await page.waitForTimeout(1000);
    
    // URL should not change
    expect(page.url()).toBe(initialUrl);
    
    // Navbar should still be visible
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Tutorials content should load - check for h3 with exact text "Tutorials" or h1
    const tutorialsHeading = page.locator('#content h3, #content h1').filter({ hasText: /^Tutorials$/ });
    await expect(tutorialsHeading.first()).toHaveText('Tutorials', { timeout: 3000 });
  });

  test('content does not duplicate on multiple navigations', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForTimeout(500);
    
    // Navigate to Projects multiple times
    for (let i = 0; i < 3; i++) {
      await page.getByRole('link', { name: 'Projects' }).click();
      await page.waitForTimeout(1500);
      
      // Should only have one Projects heading (check both h1 and h3)
      const projectsHeadings = page.locator('#content h1, #content h3').filter({ hasText: /^Projects$/ });
      const count = await projectsHeadings.count();
      expect(count).toBe(1);
    }
  });
});

