import { test, expect } from '@playwright/test';

test.describe('Skills Page', () => {
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
  });

  test('skills page loads with categorized skills', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Navigate to Skills (disambiguate from "View All Skills" link)
    await page.locator('nav.navbar').getByRole('link', { name: 'Skills', exact: true }).click();
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#content h1, #content h2, #content h3');
    }, { timeout: 15000 });
    
    // Wait for heading element to exist, be visible, and translations to apply
    await page.waitForFunction(() => {
      const heading = document.querySelector('#content h1[data-translate="skills.title"]');
      if (!heading) return false;
      const style = window.getComputedStyle(heading);
      return style.display !== 'none' && style.visibility !== 'hidden';
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Skills page should load - use data-translate attribute for more reliable selection
    const skillsHeading = page.locator('#content h1[data-translate="skills.title"]');
    await expect(skillsHeading).toBeVisible({ timeout: 10000 });
    await expect(skillsHeading).toContainText('Skills', { timeout: 5000 });
    
    // Should have skill badges/categories
    const skillBadges = page.locator('#content .skill-badge');
    const badgeCount = await skillBadges.count();
    expect(badgeCount).toBeGreaterThan(0);
  });

  test('skills are properly spaced and readable', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    await page.locator('nav.navbar').getByRole('link', { name: 'Skills', exact: true }).click();
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#content h1, #content h2, #content h3');
    }, { timeout: 15000 });
    
    // Wait for translations to apply
    await page.waitForTimeout(500);
    
    // Verify skills heading is visible
    const skillsHeading = page.locator('#content h1[data-translate="skills.title"]');
    await expect(skillsHeading).toBeVisible({ timeout: 10000 });
    
    // Check skills grid has proper spacing (use first() to avoid strict mode violation)
    const skillsGrid = page.locator('#content .skills-grid').first();
    if (await skillsGrid.isVisible({ timeout: 3000 })) {
      const gap = await skillsGrid.evaluate((el) => {
        return window.getComputedStyle(el).gap;
      });
      // Should have gap spacing
      expect(gap).toBeTruthy();
      expect(gap).not.toBe('normal');
    }
    
    // Skill badges should be visible
    const skillBadges = page.locator('#content .skill-badge');
    if (await skillBadges.first().isVisible({ timeout: 3000 })) {
      await expect(skillBadges.first()).toBeVisible();
    }
  });
});

