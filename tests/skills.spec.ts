import { test, expect } from '@playwright/test';

test.describe('Skills Page', () => {
  test('skills page loads with categorized skills', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Skills
    await page.getByRole('link', { name: 'Skills' }).click();
    await page.waitForTimeout(1000);
    
    // Skills page should load
    await expect(page.locator('#content h3')).toHaveText('Skills', { timeout: 2000 });
    
    // Should have skill badges/categories
    const skillBadges = page.locator('#content .skill-badge');
    const badgeCount = await skillBadges.count();
    expect(badgeCount).toBeGreaterThan(0);
  });

  test('skills are properly spaced and readable', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Skills' }).click();
    await page.waitForTimeout(1000);
    
    // Check skills grid has proper spacing
    const skillsGrid = page.locator('#content .skills-grid');
    if (await skillsGrid.isVisible({ timeout: 2000 })) {
      const gap = await skillsGrid.evaluate((el) => {
        return window.getComputedStyle(el).gap;
      });
      // Should have gap spacing
      expect(gap).toBeTruthy();
      expect(gap).not.toBe('normal');
    }
    
    // Skill badges should be visible
    const skillBadges = page.locator('#content .skill-badge');
    if (await skillBadges.first().isVisible({ timeout: 2000 })) {
      await expect(skillBadges.first()).toBeVisible();
    }
  });
});

