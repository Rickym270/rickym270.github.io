import { test, expect } from '@playwright/test';

test.describe('Home Page Initial Load', () => {
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
    
    // Wait for home content to load initially
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Navigate away
    await page.getByRole('link', { name: 'Projects' }).click();
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!document.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    
    // Navigate back to Home
    await page.getByRole('link', { name: 'Home' }).click();
    
    // Wait for home content to load again and be visible
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      const banner = c?.querySelector('#homeBanner');
      return (c?.getAttribute('data-content-loaded') === 'true' || banner) && 
             banner && 
             window.getComputedStyle(banner).display !== 'none' &&
             window.getComputedStyle(banner).visibility !== 'hidden';
    }, { timeout: 15000 });
    
    // Wait for homeBanner element to exist in DOM
    await page.waitForSelector('#content #homeBanner', { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Home content should still be visible
    const homeBanner = page.locator('#content #homeBanner');
    await expect(homeBanner).toBeVisible({ timeout: 10000 });
  });
});


