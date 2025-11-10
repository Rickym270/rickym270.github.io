import { test, expect } from '@playwright/test';

test.describe('Home Page Initial Load', () => {
  test('loads Home content on initial load', async ({ page }) => {
    await page.goto('/');
    
    // Wait for content to load - give SPA time to initialize
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Banner should be visible
    const banner = page.locator('#content #homeBanner');
    await expect(banner).toBeVisible({ timeout: 5000 });
    
    // Hero buttons should be visible (updated button text)
    const linkedInBtn = page.getByRole('link', { name: /Connect on LinkedIn/i });
    const githubBtn = page.getByRole('link', { name: /View GitHub/i });
    
    // At least one should be visible (fallback to old text if needed)
    const hasNewButtons = await linkedInBtn.isVisible({ timeout: 2000 }).catch(() => false) || 
                          await githubBtn.isVisible({ timeout: 2000 }).catch(() => false);
    const hasOldButtons = await page.getByRole('link', { name: /^LinkedIn$/ }).isVisible({ timeout: 1000 }).catch(() => false) ||
                          await page.getByRole('link', { name: /^GitHub$/i }).isVisible({ timeout: 1000 }).catch(() => false);
    
    expect(hasNewButtons || hasOldButtons).toBe(true);
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


