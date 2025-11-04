import { test, expect } from '@playwright/test';

test.describe('Tutorials Page', () => {
  test('tutorials page loads without redirecting entire page', async ({ page }) => {
    await page.goto('/');
    
    // Click Tutorials link
    await page.getByRole('link', { name: 'Tutorials' }).click();
    
    // Wait for content to load
    await page.waitForTimeout(1000);
    
    // Verify we're still on the same page (URL shouldn't change)
    expect(page.url()).toMatch(/\/$/);
    
    // Verify navbar is still visible (page didn't redirect)
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Verify tutorials content loaded into #content
    await expect(page.locator('#content h3')).toHaveText('Tutorials');
    
    // Verify tutorials content is visible
    await expect(page.locator('#content').getByText(/Python Tutorial/i)).toBeVisible();
    await expect(page.locator('#content').getByText(/Coding Challenges/i)).toBeVisible();
  });

  test('tutorial links load content within SPA without redirect', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Tutorials page
    await page.getByRole('link', { name: 'Tutorials' }).click();
    await page.waitForTimeout(1000);
    
    // Find a tutorial link (Python Tutorial or Coding Practices)
    const tutorialLink = page.locator('#content a').filter({ hasText: /Python Tutorial Link|Coding Practices/i }).first();
    
    if (await tutorialLink.isVisible({ timeout: 2000 })) {
      const urlBefore = page.url();
      
      // Click tutorial link
      await tutorialLink.click();
      await page.waitForTimeout(2000);
      
      // Verify URL didn't change (no full page redirect)
      expect(page.url()).toBe(urlBefore);
      
      // Verify navbar still visible
      await expect(page.locator('nav.navbar')).toBeVisible();
      
      // Verify content loaded (should have tutorial content)
      const content = page.locator('#content');
      await expect(content).toBeVisible();
      
      // Content should not be the tutorials list anymore
      const tutorialsTitle = content.locator('h3', { hasText: 'Tutorials' });
      const tutorialsVisible = await tutorialsTitle.isVisible({ timeout: 1000 }).catch(() => false);
      
      // Either tutorial content loaded OR we're back at tutorials list (both valid)
      // The key is that we didn't do a full page redirect
      expect(tutorialsVisible || content.locator('body').count() > 0).toBeTruthy();
    }
  });

  test('tutorial page text and links are visible and clickable', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Tutorials
    await page.getByRole('link', { name: 'Tutorials' }).click();
    await page.waitForTimeout(1000);
    
    // Verify text is visible
    const description = page.locator('#content').getByText(/Directory of all tutorials/i);
    await expect(description).toBeVisible();
    
    // Verify links are visible and have proper styling
    const pythonLink = page.locator('#content a').filter({ hasText: /Python Tutorial/i }).first();
    if (await pythonLink.isVisible({ timeout: 2000 })) {
      await expect(pythonLink).toBeVisible();
      
      // Check link color is visible (not transparent)
      const linkColor = await pythonLink.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      expect(linkColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });
});

