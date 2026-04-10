import { test, expect } from '@playwright/test';

test.describe('Mermaid diagrams', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('siteLanguage', 'en');
    });
  });

  test('renders diagram when smoke fixture is loaded via SPA', async ({ page }) => {
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

    await page.getByTestId('mermaid-smoke-spa').click({ force: true });

    await page.waitForFunction(
      () => document.querySelector('#content')?.getAttribute('data-content-loaded') === 'true',
      { timeout: 15_000 }
    );

    await expect(page.locator('#content svg').first()).toBeVisible({ timeout: 25_000 });
    await expect(page.getByTestId('mermaid-smoke-root')).toBeVisible();
  });

  test('renders diagram on full-page load of smoke fixture', async ({ page }) => {
    await page.goto('/data/projects/mermaid-smoke/index.html', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });

    await expect(page.locator('[data-testid="mermaid-smoke-root"] svg').first()).toBeVisible({
      timeout: 25_000,
    });
  });
});
