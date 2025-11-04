import { test, expect } from '@playwright/test';

test.describe('Tutorials Page', () => {
  test('tutorials page loads without redirecting entire page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForTimeout(500);
    
    const initialUrl = page.url();
    
    // Click Tutorials link
    await page.getByRole('link', { name: 'Tutorials' }).click();
    
    // Wait for content to load
    await page.waitForTimeout(1500);
    
    // Verify we're still on the same page (URL shouldn't change)
    expect(page.url()).toBe(initialUrl);
    
    // Verify navbar is still visible (page didn't redirect)
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Verify tutorials content loaded into #content
    await expect(page.locator('#content h3')).toHaveText('Tutorials', { timeout: 3000 });
    
    // Verify tutorials content is visible - use first() to avoid strict mode violation
    const tutorialText = page.locator('#content').getByText(/Python Tutorial|Coding Practices/i).first();
    await expect(tutorialText).toBeVisible({ timeout: 2000 });
  });

  test('tutorial links load content within SPA without redirect', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForTimeout(500);
    
    // Navigate to Tutorials page
    await page.getByRole('link', { name: 'Tutorials' }).click();
    await page.waitForTimeout(1500);
    
    // Find a tutorial link (Python Tutorial or Coding Practices)
    const tutorialLink = page.locator('#content a').filter({ hasText: /Python Tutorial|Coding Practices/i }).first();
    
    if (await tutorialLink.isVisible({ timeout: 3000 })) {
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
      
      // Content should not be the tutorials list anymore (or might be, but should not redirect)
      const tutorialsTitle = content.locator('h3', { hasText: 'Tutorials' });
      const tutorialsVisible = await tutorialsTitle.isVisible({ timeout: 1000 }).catch(() => false);
      
      // Check if we have any content loaded (h3 elements or tutorial content)
      const h3Count = await content.locator('h3').count();
      const hasContent = tutorialsVisible || h3Count > 0;
      
      // The key is that we didn't do a full page redirect - navbar should still be there
      // and URL should not have changed
      expect(hasContent).toBeTruthy();
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

