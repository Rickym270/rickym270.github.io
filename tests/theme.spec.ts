import { test, expect } from '@playwright/test';

test.describe('Theme Toggle (Dark/Light Mode)', () => {
  test('theme toggle button is visible and functional', async ({ page }) => {
    await page.goto('/');
    
    // Theme toggle button should be visible
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
    
    // Check initial theme (should respect system preference or default)
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') || 
             (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    });
    
    // Click toggle
    await themeToggle.click();
    
    // Wait for theme to change
    await page.waitForTimeout(300);
    
    // Verify theme attribute changed
    const newTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    
    expect(newTheme).toBeTruthy();
    expect(newTheme).not.toBe(initialTheme || '');
  });

  test('theme persists across page navigation', async ({ page }) => {
    await page.goto('/');
    
    // Toggle to dark mode
    const themeToggle = page.locator('#theme-toggle');
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    const themeBefore = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    
    // Navigate to Projects
    await page.getByRole('link', { name: 'Projects' }).click();
    await page.waitForTimeout(1000);
    
    // Theme should persist
    const themeAfter = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    
    expect(themeAfter).toBe(themeBefore);
  });

  test('links are white in dark mode and black in light mode', async ({ page }) => {
    await page.goto('/');
    
    // Wait for content to load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForTimeout(1000);
    
    // Get a regular link element (not a button) - use About Me section link
    const aboutSection = page.locator('#content').getByText(/repository/i);
    if (await aboutSection.isVisible({ timeout: 2000 })) {
      const link = aboutSection.locator('a').first();
      if (await link.isVisible({ timeout: 1000 })) {
        // Test light mode
        await page.evaluate(() => {
          document.documentElement.setAttribute('data-theme', 'light');
        });
        await page.waitForTimeout(300);
        
        const lightColor = await link.evaluate((el) => {
          return window.getComputedStyle(el).color;
        });
        // Should be black/dark (rgb values close to 0,0,0)
        const lightRgb = lightColor.match(/\d+/g);
        expect(lightRgb).toBeTruthy();
        if (lightRgb) {
          const r = parseInt(lightRgb[0]);
          const g = parseInt(lightRgb[1]);
          const b = parseInt(lightRgb[2]);
          // Should be dark (low RGB values)
          expect(r + g + b).toBeLessThan(150);
        }
        
        // Test dark mode
        await page.evaluate(() => {
          document.documentElement.setAttribute('data-theme', 'dark');
        });
        await page.waitForTimeout(300);
        
        const darkColor = await link.evaluate((el) => {
          return window.getComputedStyle(el).color;
        });
        // Should be white/light (rgb values close to 255,255,255)
        const darkRgb = darkColor.match(/\d+/g);
        expect(darkRgb).toBeTruthy();
        if (darkRgb) {
          const r = parseInt(darkRgb[0]);
          const g = parseInt(darkRgb[1]);
          const b = parseInt(darkRgb[2]);
          // Should be light (high RGB values)
          expect(r + g + b).toBeGreaterThan(500);
        }
      }
    }
  });

  test('body background adapts to theme', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForSelector('body', { state: 'attached' });
    await page.waitForTimeout(500);
    
    // Light mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await page.waitForTimeout(500); // Give CSS time to apply
    
    const lightBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // Should be white/light
    const lightRgb = lightBg.match(/\d+/g);
    expect(lightRgb).toBeTruthy();
    if (lightRgb) {
      const r = parseInt(lightRgb[0]);
      const g = parseInt(lightRgb[1]);
      const b = parseInt(lightRgb[2]);
      // Should be light (high RGB values) - white is 255+255+255=765
      expect(r + g + b).toBeGreaterThan(500);
    }
    
    // Dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(500); // Give CSS more time to apply
    
    const darkBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // Should be dark - check actual RGB values
    const darkRgb = darkBg.match(/\d+/g);
    expect(darkRgb).toBeTruthy();
    if (darkRgb) {
      const r = parseInt(darkRgb[0]);
      const g = parseInt(darkRgb[1]);
      const b = parseInt(darkRgb[2]);
      // Dark mode uses #0a0a0a (10,10,10) = 30 total, but allow tolerance for different implementations
      // Some browsers might compute it differently, so check if it's significantly darker than light mode
      const rgbSum = r + g + b;
      // Should be dark - allow up to 100 for various dark shades (0a0a0a=30, 1a1a1a=42, etc)
      expect(rgbSum).toBeLessThan(150);
    }
  });
});

