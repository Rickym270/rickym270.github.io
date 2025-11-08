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

      // Wait for jQuery to be ready
      await page.waitForFunction(() => typeof window.jQuery !== 'undefined' && typeof window.jQuery.fn.load !== 'undefined', { timeout: 10000 });
      // Wait for content container first
      await page.waitForSelector('#content', { state: 'attached' });
      // Wait for content to actually load
      await page.waitForFunction(() => {
        const content = document.querySelector('#content');
        if (!content) return false;
        const banner = content.querySelector('#homeBanner');
        if (banner) return true;
        if (content.getAttribute('data-content-loaded') === 'true') return true;
        const html = content.innerHTML.trim();
        if (html && html.length > 50) return true;
        return false;
      }, { timeout: 20000 });

      // Navbar should be visible and not overflow horizontally
      const nav = page.locator('nav.navbar');
      await expect(nav).toBeVisible();
      const body = page.locator('body');
      await expect(body).toHaveCSS('overflow-x', 'hidden');

      // Banner should be visible and not overflow viewport width
      const banner = page.locator('#content #homeBanner');
      await expect(banner).toBeVisible({ timeout: 10000 });
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


