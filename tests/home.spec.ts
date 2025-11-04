import { test, expect } from '@playwright/test';

test.describe('Home Page Initial Load', () => {
  test('loads Home content on initial load', async ({ page }) => {
    await page.goto('/');
    
    // Wait for content to load - give SPA time to initialize
    await page.waitForSelector('#content', { state: 'attached' });
    
    // Wait for home page content to be loaded (banner should appear)
    const banner = page.locator('#content #homeBanner');
    await expect(banner).toBeVisible({ timeout: 5000 });
    
    // Social links should be visible
    await expect(page.getByRole('link', { name: /^LinkedIn$/ })).toBeVisible({ timeout: 2000 });
  });

  test('home page does not get replaced when navigating away and back', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Navigate away
    await page.getByRole('link', { name: 'Projects' }).click();
    await page.waitForTimeout(1000);
    
    // Navigate back to Home
    await page.getByRole('link', { name: 'Home' }).click();
    await page.waitForTimeout(1000);
    
    // Home content should still be visible
    await expect(page.locator('#content #homeBanner')).toBeVisible({ timeout: 2000 });
  });
});


