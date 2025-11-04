import { test, expect } from '@playwright/test';

test.describe('SPA Navigation', () => {
  test('navigation loads content into #content without full page reload', async ({ page }) => {
    await page.goto('/');
    
    // Initial page load
    const initialUrl = page.url();
    await expect(page.locator('#content')).toBeVisible();
    
    // Navigate to Projects
    await page.getByRole('link', { name: 'Projects' }).click();
    await page.waitForTimeout(1000);
    
    // URL should not change
    expect(page.url()).toBe(initialUrl);
    
    // Navbar should remain visible
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Content should have changed
    await expect(page.locator('#content h3')).toHaveText('Projects');
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
    
    // Tutorials content should load
    await expect(page.locator('#content h3')).toHaveText('Tutorials');
  });

  test('content does not duplicate on multiple navigations', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Projects multiple times
    for (let i = 0; i < 3; i++) {
      await page.getByRole('link', { name: 'Projects' }).click();
      await page.waitForTimeout(1000);
      
      // Should only have one Projects heading
      const headings = page.locator('#content h3');
      const projectsHeadings = headings.filter({ hasText: 'Projects' });
      const count = await projectsHeadings.count();
      expect(count).toBe(1);
    }
  });
});

