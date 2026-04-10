import { test, expect } from '@playwright/test';

test.describe('Mermaid diagrams', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('siteLanguage', 'en');
    });
  });

  test('renders diagram when AI tutorial is loaded via SPA from Tutorials', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', {
      waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit',
      timeout: 60_000,
    });

    await page.waitForFunction(
      () => {
        const c = document.querySelector('#content');
        return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
      },
      { timeout: 15_000 }
    );

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.evaluate(() => {
        const panel = document.getElementById('mobile-nav-panel-docs');
        if (panel) {
          panel.classList.add('mobile-nav-group-panel-open');
          panel.setAttribute('aria-hidden', 'false');
        }
      });
      await page.locator('#mobile-nav-panel-docs a[data-url="html/pages/tutorials.html"]').click();
    } else {
      await page.locator('#navbarDropdownMenuLink, #navbarDropdownMenuLinkMedium').first().click();
      await page.locator('a.dropdown-item[data-url="html/pages/tutorials.html"]').first().click();
    }

    await page.waitForFunction(
      () => document.querySelector('#content')?.getAttribute('data-content-loaded') === 'true',
      { timeout: 15_000 }
    );

    await page.getByTestId('ai-tutorial-spa').click();

    await page.waitForFunction(
      () => document.querySelector('#content')?.getAttribute('data-content-loaded') === 'true',
      { timeout: 15_000 }
    );

    await expect(page.getByTestId('ai-tutorial-guide')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('#content svg').first()).toBeVisible({ timeout: 25_000 });
  });

  test('renders diagram on full-page load of AI tutorial', async ({ page }) => {
    await page.goto('/data/projects/aiAutomationTut/index.html', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });

    await expect(page.getByTestId('ai-tutorial-guide')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('[data-testid="ai-tutorial-guide"] svg').first()).toBeVisible({
      timeout: 25_000,
    });
  });
});
