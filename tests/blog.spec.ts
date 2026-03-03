import { test, expect } from '@playwright/test';

test.describe('Blog Pages', () => {
  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('siteLanguage', 'en');
    });
  });

  test('Engineering page loads via Blog dropdown', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.evaluate(() => {
        const panel = document.getElementById('mobile-nav-panel-blog');
        if (panel) {
          panel.classList.add('mobile-nav-group-panel-open');
          panel.setAttribute('aria-hidden', 'false');
        }
      });
      await page.locator('#mobile-nav-panel-blog').getByRole('link', { name: 'Engineering' }).click();
    } else {
      const blogButton = page.locator('#navbar-links').getByRole('button', { name: 'Blog' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Blog' })
      );
      await blogButton.hover();
      await page.locator('.dropdown-menu-blog').first().getByRole('link', { name: 'Engineering' }).click();
    }

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('h1');
    }, { timeout: 15000 });

    const heading = page.locator('#content h1').filter({ hasText: /Engineering/i });
    await expect(heading).toBeVisible({ timeout: 5000 });
    await expect(heading).toContainText('Engineering');
  });

  test('Personal page loads via Blog dropdown', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.evaluate(() => {
        const panel = document.getElementById('mobile-nav-panel-blog');
        if (panel) {
          panel.classList.add('mobile-nav-group-panel-open');
          panel.setAttribute('aria-hidden', 'false');
        }
      });
      await page.locator('#mobile-nav-panel-blog').getByRole('link', { name: 'Personal' }).click();
    } else {
      const blogButton = page.locator('#navbar-links').getByRole('button', { name: 'Blog' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Blog' })
      );
      await blogButton.hover();
      await page.locator('.dropdown-menu-blog').first().getByRole('link', { name: 'Personal' }).click();
    }

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('h1');
    }, { timeout: 15000 });

    const heading = page.locator('#content h1').filter({ hasText: /Personal/i });
    await expect(heading).toBeVisible({ timeout: 5000 });
    await expect(heading).toContainText('Personal');
  });
});
