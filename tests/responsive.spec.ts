import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile', size: { width: 375, height: 812 } },
  { name: 'tablet', size: { width: 768, height: 1024 } },
  { name: 'desktop', size: { width: 1280, height: 800 } },
];

test.describe('Responsive layout', () => {
  for (const vp of viewports) {
    test(`home layout is cohesive on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize(vp.size);
      await page.goto('/');

      // Wait for content to load
      await page.waitForSelector('#content', { state: 'attached' });
      await page.waitForTimeout(1000);

      // Navbar should be visible and not overflow horizontally
      const nav = page.locator('nav.navbar');
      await expect(nav).toBeVisible();
      const body = page.locator('body');
      await expect(body).toHaveCSS('overflow-x', 'hidden');

      // Banner should be visible and not overflow viewport width
      const banner = page.locator('#content #homeBanner');
      await expect(banner).toBeVisible({ timeout: 3000 });
      const bannerBox = await banner.boundingBox();
      expect(bannerBox).toBeTruthy();
      if (bannerBox) {
        expect(Math.round(bannerBox.width)).toBeLessThanOrEqual(vp.size.width + 1);
      }

      // Critical content should remain visible
      await expect(page.getByRole('link', { name: /^LinkedIn$/ })).toBeVisible({ timeout: 2000 });
      await expect(page.getByRole('link', { name: /^GitHub$/i })).toBeVisible({ timeout: 2000 });

      // Allow small tolerance for scrollbar width differences across browsers
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      const overflowPx = Math.ceil(scrollWidth - clientWidth);
      expect(overflowPx).toBeLessThanOrEqual(16);
    });
  }
});


