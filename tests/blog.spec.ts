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

    // Blog dropdown only exists on desktop/medium (not in mobile sidebar)
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      test.skip();
    }

    const blogButton = page.locator('#navbar-links').getByRole('button', { name: 'Blog' }).or(
      page.locator('#navbar-links').getByRole('link', { name: 'Blog' })
    );
    await blogButton.hover();
    await page.locator('.dropdown-menu-blog').first().getByRole('link', { name: 'Engineering' }).click();

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

    // Blog dropdown only exists on desktop/medium (not in mobile sidebar)
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      test.skip();
    }

    const blogButton = page.locator('#navbar-links').getByRole('button', { name: 'Blog' }).or(
      page.locator('#navbar-links').getByRole('link', { name: 'Blog' })
    );
    await blogButton.hover();
    await page.locator('.dropdown-menu-blog').first().getByRole('link', { name: 'Personal' }).click();

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('h1');
    }, { timeout: 15000 });

    const heading = page.locator('#content h1').filter({ hasText: /Personal/i });
    await expect(heading).toBeVisible({ timeout: 5000 });
    await expect(heading).toContainText('Personal');
  });
});
