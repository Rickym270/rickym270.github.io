import { test, expect } from '@playwright/test';

test.describe('Journal Page', () => {
  test('journal page loads and text is visible', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Docs > Journal
    await page.getByRole('button', { name: 'Docs' }).or(page.getByRole('link', { name: 'Docs' })).hover();
    await page.getByRole('link', { name: 'Journal' }).click();
    await page.waitForTimeout(1000);
    
    // Verify journal content loaded
    await expect(page.locator('#content h2').first()).toBeVisible();
    
    // Check that text is visible and readable
    const journalText = page.locator('#content').getByText(/Memories|Impromptu note|I am back/i);
    await expect(journalText.first()).toBeVisible({ timeout: 2000 });
    
    // Verify text has proper font size
    const container = page.locator('#content #main, #content .container');
    if (await container.isVisible({ timeout: 2000 })) {
      const fontSize = await container.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      const fontSizeNum = parseFloat(fontSize);
      // Should be readable (at least 12px)
      expect(fontSizeNum).toBeGreaterThanOrEqual(12);
    }
  });

  test('journal text is visible in both light and dark modes', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Journal
    await page.getByRole('button', { name: 'Docs' }).or(page.getByRole('link', { name: 'Docs' })).hover();
    await page.getByRole('link', { name: 'Journal' }).click();
    await page.waitForTimeout(1000);
    
    // Get a text element
    const textElement = page.locator('#content p').first();
    await expect(textElement).toBeVisible({ timeout: 2000 });
    
    // Test light mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await page.waitForTimeout(200);
    
    const lightColor = await textElement.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    // Should be visible (not transparent)
    expect(lightColor).not.toBe('rgba(0, 0, 0, 0)');
    
    // Test dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(200);
    
    const darkColor = await textElement.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    // Should be visible (not transparent)
    expect(darkColor).not.toBe('rgba(0, 0, 0, 0)');
    
    // In dark mode, should be light colored
    const darkRgb = darkColor.match(/\d+/g);
    if (darkRgb) {
      const r = parseInt(darkRgb[0]);
      const g = parseInt(darkRgb[1]);
      const b = parseInt(darkRgb[2]);
      // Should be light (high RGB values for dark mode)
      expect(r + g + b).toBeGreaterThan(400);
    }
  });
});

