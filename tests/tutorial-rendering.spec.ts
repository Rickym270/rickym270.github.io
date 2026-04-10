import { test, expect } from '@playwright/test';
import {
  gotoHomeReady,
  openAiTutorialFromTutorialsCard,
  openTutorialsPageFromNav,
  switchSiteLanguage,
} from './ai-tutorial.helpers';

test.describe('[regression] Tutorial rendering (AI guide)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('siteLanguage', 'en');
    });
  });

  test('prompt code blocks have readable line height and no code-block-wrapper (SPA)', async ({
    page,
  }) => {
    await gotoHomeReady(page);
    await openTutorialsPageFromNav(page);
    await openAiTutorialFromTutorialsCard(page);

    const guide = page.getByTestId('ai-tutorial-guide');
    await expect(guide).toBeVisible();

    await expect(guide.locator('.code-block-wrapper')).toHaveCount(0);

    const promptPres = guide.locator('.lesson-body pre.bg-light');
    await expect(promptPres).toHaveCount(2);

    const n = await promptPres.count();
    for (let i = 0; i < n; i++) {
      const pre = promptPres.nth(i);
      const code = pre.locator('code').first();
      await expect(code).toBeVisible();
      await expect(code).not.toHaveText(/^\s*$/);

      const box = await pre.boundingBox();
      expect(box?.height, 'prompt pre should have non-collapsed height').toBeGreaterThan(40);

      const { lineHeightPx, fontSizePx, clientHeight } = await pre.evaluate((el) => {
        const c = el.querySelector('code');
        const preStyle = getComputedStyle(el);
        const codeStyle = c ? getComputedStyle(c) : preStyle;
        const fontSize = parseFloat(codeStyle.fontSize);
        const lh = preStyle.lineHeight;
        let lineHeightPxLocal: number;
        if (lh === 'normal') {
          lineHeightPxLocal = fontSize * 1.2;
        } else {
          lineHeightPxLocal = parseFloat(lh);
        }
        return {
          lineHeightPx: lineHeightPxLocal,
          fontSizePx: fontSize,
          clientHeight: el.clientHeight,
        };
      });

      expect(lineHeightPx, 'line-height should not be collapsed').toBeGreaterThanOrEqual(10);
      expect(clientHeight, 'multiline prompt should not collapse vertically').toBeGreaterThanOrEqual(
        Math.min(fontSizePx * 2, 32)
      );
    }
  });

  test('prompt blocks and Mermaid layout stay healthy after switch to Spanish (SPA)', async ({
    page,
  }) => {
    await gotoHomeReady(page);
    await openTutorialsPageFromNav(page);
    await openAiTutorialFromTutorialsCard(page);

    const guide = page.getByTestId('ai-tutorial-guide');

    await expect(async () => {
      const mermaidCount = await guide.locator('.lesson-body pre.mermaid svg').count();
      expect(mermaidCount).toBe(3);
    }).toPass({ timeout: 25_000, intervals: [500, 1000, 2000] });

    const mermaidPres = guide.locator('.lesson-body pre.mermaid');
    await expect(mermaidPres).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      const pre = mermaidPres.nth(i);
      const box = await pre.boundingBox();
      expect(box?.height, 'mermaid pre height').toBeGreaterThan(24);
      expect(box?.width, 'mermaid pre width').toBeGreaterThan(40);
      const svgBox = await pre.locator('svg').first().boundingBox();
      expect(svgBox?.height, 'mermaid svg height').toBeGreaterThan(16);
      expect(svgBox?.width, 'mermaid svg width').toBeGreaterThan(16);
    }

    await switchSiteLanguage(page, 'es');

    await expect(guide.locator('.code-block-wrapper')).toHaveCount(0);

    const promptPres = guide.locator('.lesson-body pre.bg-light');
    await expect(promptPres).toHaveCount(2);
    const pn = await promptPres.count();
    for (let i = 0; i < pn; i++) {
      const pre = promptPres.nth(i);
      await expect(pre.locator('code').first()).toBeVisible();
      const box = await pre.boundingBox();
      expect(box?.height, 'prompt pre height after ES').toBeGreaterThan(40);
    }

    await expect(async () => {
      const mermaidCount = await guide.locator('.lesson-body pre.mermaid svg').count();
      expect(mermaidCount).toBe(3);
    }).toPass({ timeout: 25_000, intervals: [500, 1000, 2000] });

    for (let i = 0; i < 3; i++) {
      const pre = mermaidPres.nth(i);
      const box = await pre.boundingBox();
      expect(box?.height, 'mermaid pre height after ES').toBeGreaterThan(24);
      const svgBox = await pre.locator('svg').first().boundingBox();
      expect(svgBox?.height, 'mermaid svg height after ES').toBeGreaterThan(16);
    }
  });
});
