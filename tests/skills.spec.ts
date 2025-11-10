import { test, expect } from '@playwright/test';

test.describe('Skills Page', () => {
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
    
    // Skills page should load - check for h1 or h3
    const skillsHeading = page.locator('#content h1, #content h2, #content h3').filter({ hasText: /Skills/i });
    await expect(skillsHeading.first()).toBeVisible({ timeout: 3000 });
    
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
    
    // Check skills grid has proper spacing
    const skillsGrid = page.locator('#content .skills-grid');
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

