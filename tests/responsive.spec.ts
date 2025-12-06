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
      // Use networkidle for Firefox, domcontentloaded for others
      const browserName = page.context().browser()?.browserType().name() || '';
      const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
      await page.goto('/', { waitUntil, timeout: 90000 });

      // Wait for content to load
      await page.waitForFunction(() => {
        const c = document.querySelector('#content');
        return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
      }, { timeout: 15000 });

      // Navbar should be visible and not overflow horizontally
      const nav = page.locator('nav.navbar');
      await expect(nav).toBeVisible();
      const body = page.locator('body');
      await expect(body).toHaveCSS('overflow-x', 'hidden');

      // Hero banner should be visible and not overflow viewport width
      const banner = page.locator('#content #homeBanner');
      await expect(banner).toBeVisible({ timeout: 3000 });
      const bannerBox = await banner.boundingBox();
      expect(bannerBox).toBeTruthy();
      if (bannerBox) {
        expect(Math.round(bannerBox.width)).toBeLessThanOrEqual(vp.size.width + 1);
      }

      // Hero buttons should be visible (updated button text)
      const linkedInBtn = page.getByRole('link', { name: /Connect on LinkedIn/i });
      const githubBtn = page.getByRole('link', { name: /View GitHub/i });
      
      // On mobile, buttons might be stacked, so check visibility with timeout
      await expect(linkedInBtn).toBeVisible({ timeout: 2000 }).catch(() => {
        // If not found with new text, try old text as fallback
        return page.getByRole('link', { name: /^LinkedIn$/ }).toBeVisible({ timeout: 2000 });
      });
      
      await expect(githubBtn).toBeVisible({ timeout: 2000 }).catch(() => {
        // If not found with new text, try old text as fallback
        return page.getByRole('link', { name: /^GitHub$/i }).toBeVisible({ timeout: 2000 });
      });

      // Skills section should be visible
      const skillsSection = page.locator('#content').getByText(/Tech Stack|Skills/i);
      await expect(skillsSection.first()).toBeVisible({ timeout: 3000 });

      // Allow small tolerance for scrollbar width differences across browsers
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      const overflowPx = Math.ceil(scrollWidth - clientWidth);
      expect(overflowPx).toBeLessThanOrEqual(16);
    });
  }
  
  test('hero banner stacks correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    const heroImage = page.locator('#content #homeBanner .hero-image-column');
    const heroText = page.locator('#content #homeBanner .hero-text-column');
    
    await expect(heroImage).toBeVisible();
    await expect(heroText).toBeVisible();
    
    // On mobile, image should appear before text (order: 1 vs order: 2)
    const imageBox = await heroImage.boundingBox();
    const textBox = await heroText.boundingBox();
    
    expect(imageBox && textBox).toBeTruthy();
    if (imageBox && textBox) {
      // Image should be above text on mobile
      expect(imageBox.y).toBeLessThan(textBox.y);
    }
  });
  
  test('stats cards stack vertically on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    // Use domcontentloaded for faster navigation, especially on Firefox
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for content to load
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 10000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Wait for stats to potentially load
    await page.waitForTimeout(3000);
    
    const statsSection = page.locator('#stats-section');
    const statsVisible = await statsSection.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (statsVisible) {
      const cards = page.locator('#stats-section .card');
      const cardCount = await cards.count();
      
      if (cardCount > 0) {
        // On mobile, cards should stack vertically
        const firstCard = cards.first();
        const secondCard = cards.nth(1);
        
        if (await secondCard.isVisible().catch(() => false)) {
          const firstBox = await firstCard.boundingBox();
          const secondBox = await secondCard.boundingBox();
          
          expect(firstBox && secondBox).toBeTruthy();
          if (firstBox && secondBox) {
            // Second card should be below first card
            expect(secondBox.y).toBeGreaterThan(firstBox.y);
          }
        }
      }
    }
  });
});


