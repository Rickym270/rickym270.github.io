import { test, expect } from '@playwright/test';
import {
  gotoHomeReady,
  openAiTutorialFromTutorialsCard,
  openTutorialsPageFromNav,
  switchSiteLanguage,
} from './ai-tutorial.helpers';

test.describe('[regression] Mermaid diagrams', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('siteLanguage', 'en');
    });
  });

  test('renders diagram when AI tutorial is loaded via SPA from Tutorials', async ({ page }) => {
    await gotoHomeReady(page);
    await openTutorialsPageFromNav(page);
    await openAiTutorialFromTutorialsCard(page);

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

  test('all three Mermaid blocks render SVG inside AI tutorial (SPA)', async ({ page }) => {
    await gotoHomeReady(page);
    await openTutorialsPageFromNav(page);
    await openAiTutorialFromTutorialsCard(page);

    await expect(async () => {
      const count = await page.locator('[data-testid="ai-tutorial-guide"] pre.mermaid svg').count();
      expect(count).toBe(3);
    }).toPass({ timeout: 25_000, intervals: [500, 1000, 2000] });
  });

  test('diagrams stay rendered as SVG after EN → ES → EN language switch (SPA)', async ({
    page,
  }) => {
    await gotoHomeReady(page);
    await openTutorialsPageFromNav(page);
    await openAiTutorialFromTutorialsCard(page);

    await expect(async () => {
      expect(await page.locator('[data-testid="ai-tutorial-guide"] pre.mermaid svg').count()).toBe(
        3
      );
    }).toPass({ timeout: 25_000, intervals: [500, 1000, 2000] });

    await switchSiteLanguage(page, 'es');
    await expect(async () => {
      expect(await page.locator('[data-testid="ai-tutorial-guide"] pre.mermaid svg').count()).toBe(
        3
      );
    }).toPass({ timeout: 25_000, intervals: [500, 1000, 2000] });

    await switchSiteLanguage(page, 'en');
    await expect(async () => {
      expect(await page.locator('[data-testid="ai-tutorial-guide"] pre.mermaid svg').count()).toBe(
        3
      );
    }).toPass({ timeout: 25_000, intervals: [500, 1000, 2000] });
  });

  test('sequence diagram block renders SVG with message text (SPA)', async ({ page }) => {
    await gotoHomeReady(page);
    await openTutorialsPageFromNav(page);
    await openAiTutorialFromTutorialsCard(page);

    await expect
      .poll(
        async () =>
          page.evaluate(() => {
            const guide = document.querySelector('[data-testid="ai-tutorial-guide"]');
            if (!guide) return 0;
            const mermaidPres = guide.querySelectorAll('pre.mermaid');
            const last = mermaidPres[mermaidPres.length - 1];
            if (!last) return 0;
            const svg = last.querySelector('svg');
            if (!svg) return 0;
            return Array.from(svg.querySelectorAll('text')).filter(
              (t) => (t.textContent || '').trim().length > 0
            ).length;
          }),
        { timeout: 25_000 }
      )
      .toBeGreaterThanOrEqual(3);
  });
});
