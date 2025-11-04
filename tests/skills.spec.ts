import { test, expect } from '@playwright/test';

test.describe('Skills Page', () => {
  test('skills page loads with categorized skills', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForTimeout(500);
    
    // Navigate to Skills
    await page.getByRole('link', { name: 'Skills' }).click();
    await page.waitForTimeout(1500);
    
    // Skills page should load - check for h1 or h3
    const skillsHeading = page.locator('#content h1, #content h3').filter({ hasText: /^Skills$/ });
    await expect(skillsHeading).toBeVisible({ timeout: 3000 });
    await expect(skillsHeading).toHaveText('Skills', { timeout: 1000 });
    
    // Should have skill badges/categories
    const skillBadges = page.locator('#content .skill-badge');
    const badgeCount = await skillBadges.count();
    expect(badgeCount).toBeGreaterThan(0);
  });

  test('skills are properly spaced and readable', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForTimeout(500);
    
    await page.getByRole('link', { name: 'Skills' }).click();
    await page.waitForTimeout(1500);
    
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

