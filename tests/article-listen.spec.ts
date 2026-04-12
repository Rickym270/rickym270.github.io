import { test, expect, type Page } from '@playwright/test';
import {
  gotoHomeReady,
  openAiTutorialFromTutorialsCard,
  openTutorialsPageFromNav,
  waitAiTutorialMermaidDiagramsStable,
} from './ai-tutorial.helpers';

/** Counts `speechSynthesis.cancel()` for SPA speech-reset assertions. */
async function installSpeechCancelCounter(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const synth = window.speechSynthesis;
    if (!synth || typeof synth.cancel !== 'function') return;
    const orig = synth.cancel.bind(synth);
    synth.cancel = function (...args: unknown[]) {
      const w = window as unknown as { __listenCancelCount: number };
      w.__listenCancelCount = (w.__listenCancelCount || 0) + 1;
      return orig(...args);
    };
  });
}

async function getListenCancelCount(page: Page): Promise<number> {
  return page.evaluate(() => (window as unknown as { __listenCancelCount?: number }).__listenCancelCount || 0);
}

/** Firefox on GitHub Actions often never reaches playing (Web Speech stays idle); Chromium covers this path. */
function skipWebSpeechPlayingAssertionsInFirefoxCi(page: Page): void {
  const name = page.context().browser()?.browserType().name() || '';
  test.skip(
    name === 'firefox' && !!process.env.CI,
    'Firefox CI: Web Speech playing state is unreliable; same flow is asserted on Chromium.'
  );
}

async function openEngineeringListing(page: Page): Promise<void> {
  const isMobile = await page.evaluate(() => window.innerWidth <= 768);
  const responsePromise = page.waitForResponse(
    (res) => res.url().includes('engineering.html') && (res.status() === 200 || res.status() === 304),
    { timeout: 20000 }
  );
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
    const engineeringLink = page.locator('#mobile-nav-panel-blog').getByRole('link', { name: 'Engineering' });
    await engineeringLink.scrollIntoViewIfNeeded();
    await engineeringLink.click();
  } else {
    const blogButton = page.locator('#navbar-links').getByRole('button', { name: 'Blog' }).or(
      page.locator('#navbar-links').getByRole('link', { name: 'Blog' })
    );
    await blogButton.hover();
    await page.locator('.dropdown-menu-blog').first().getByRole('link', { name: 'Engineering' }).click();
  }
  await responsePromise.catch(() => {});
  await page.waitForFunction(
    () => {
      const c = document.querySelector('#content');
      return (
        (c?.getAttribute('data-content-loaded') === 'true' && !!c?.querySelector('.blog-featured, h1')) ||
        !!c?.querySelector('.blog-featured')
      );
    },
    { timeout: 15_000 }
  );
}

test.describe('[regression] Article listen', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('siteLanguage', 'en');
    });
  });

  test('listen control appears on engineering article opened via SPA', async ({ page }) => {
    await gotoHomeReady(page);
    await openEngineeringListing(page);

    await page.locator('a.inline-load[data-url*="how-living-with-ms"]').first().click();
    await page.waitForFunction(
      () => document.querySelector('#content')?.getAttribute('data-content-loaded') === 'true',
      { timeout: 15_000 }
    );
    await expect(page.locator('article#post-body')).toBeVisible({ timeout: 15_000 });

    await expect(page.getByTestId('article-listen')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('article-listen').getByRole('button', { name: /Listen/i })).toBeVisible();
  });

  test('listen toggle text is visible in dark mode (contrast)', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('portfolio-theme', 'dark');
    });
    await gotoHomeReady(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await openEngineeringListing(page);
    await page.locator('a.inline-load[data-url*="how-living-with-ms"]').first().click();
    await page.waitForFunction(
      () => document.querySelector('#content')?.getAttribute('data-content-loaded') === 'true',
      { timeout: 15_000 }
    );
    await expect(page.getByTestId('article-listen')).toBeVisible({ timeout: 15_000 });

    const toggleRgb = await page.evaluate(() => {
      const btn = document.querySelector('.article-listen-toggle');
      if (!btn) return null;
      return getComputedStyle(btn).color;
    });
    expect(toggleRgb).toBeTruthy();
    const m = toggleRgb!.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    expect(m, `expected rgb color, got ${toggleRgb}`).toBeTruthy();
    const r = parseInt(m![1], 10);
    const g = parseInt(m![2], 10);
    const b = parseInt(m![3], 10);
    const luminance = r * 0.299 + g * 0.587 + b * 0.114;
    expect(luminance, `toggle text too dark on dark bar: ${toggleRgb}`).toBeGreaterThan(160);
  });

  test('listen utterance excludes Mermaid source on AI tutorial (SPA)', async ({ page }) => {
    await page.addInitScript(() => {
      const synth = window.speechSynthesis;
      if (!synth || typeof synth.speak !== 'function') return;
      const orig = synth.speak.bind(synth);
      synth.speak = function (utterance) {
        window.__lastSpeakText = utterance.text || '';
        return orig(utterance);
      };
    });

    await gotoHomeReady(page);
    await openTutorialsPageFromNav(page);
    await openAiTutorialFromTutorialsCard(page);
    await waitAiTutorialMermaidDiagramsStable(page);

    await expect(page.getByTestId('article-listen')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('article-listen').getByRole('button', { name: /Listen/i }).click();

    await expect
      .poll(async () => page.evaluate(() => (window as { __lastSpeakText?: string }).__lastSpeakText || ''))
      .not.toMatch(/flowchart|sequenceDiagram|subgraph|participant\s/i, { timeout: 10_000 });

    const spoken = await page.evaluate(() => (window as { __lastSpeakText?: string }).__lastSpeakText || '');
    expect(spoken.length).toBeGreaterThan(200);
    expect(spoken).toMatch(/AI|automation|model/i);
  });

  test('mobile viewport shows hint text beside listen control', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHomeReady(page);
    await openEngineeringListing(page);
    await page.locator('a.inline-load[data-url*="how-living-with-ms"]').first().click();
    await page.waitForFunction(
      () => document.querySelector('#content')?.getAttribute('data-content-loaded') === 'true',
      { timeout: 15_000 }
    );
    await expect(page.getByTestId('article-listen')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('.article-listen-mobile-hint')).toBeVisible();
    await expect(page.locator('.article-listen-mobile-hint')).toHaveText(/Play to read out loud/i);
  });

  test('Listen click switches toggle accessible name to Pause (playing state)', async ({ page }) => {
    skipWebSpeechPlayingAssertionsInFirefoxCi(page);
    await gotoHomeReady(page);
    await openTutorialsPageFromNav(page);
    await openAiTutorialFromTutorialsCard(page);
    await waitAiTutorialMermaidDiagramsStable(page);
    await expect(page.getByTestId('article-listen')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('article-listen').getByRole('button', { name: /Listen/i }).click();
    const toggle = page.getByTestId('article-listen').locator('[data-action="toggle"]');
    await expect.poll(async () => toggle.getAttribute('aria-pressed'), { timeout: 20_000 }).toBe('true');
  });

  test('SPA navigation away from blog post calls speech cancel while Listen is playing', async ({ page }) => {
    skipWebSpeechPlayingAssertionsInFirefoxCi(page);
    await installSpeechCancelCounter(page);
    await gotoHomeReady(page);
    await openEngineeringListing(page);
    await page.locator('a.inline-load[data-url*="how-living-with-ms"]').first().click();
    await page.waitForFunction(
      () => document.querySelector('#content')?.getAttribute('data-content-loaded') === 'true',
      { timeout: 15_000 }
    );
    await expect(page.getByTestId('article-listen')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('article-listen').getByRole('button', { name: /Listen/i }).click();
    const toggle = page.getByTestId('article-listen').locator('[data-action="toggle"]');
    await expect.poll(async () => toggle.getAttribute('aria-pressed'), { timeout: 20_000 }).toBe('true');
    const cancelsAfterPlaying = await getListenCancelCount(page);
    await page.locator('a.inline-load.post-back-link').first().click();
    await page.waitForFunction(
      () => document.querySelector('#content')?.getAttribute('data-content-loaded') === 'true',
      { timeout: 15_000 }
    );
    await expect
      .poll(async () => getListenCancelCount(page), { timeout: 10_000 })
      .toBeGreaterThan(cancelsAfterPlaying);
  });

  test('SPA navigation away from AI tutorial calls speech cancel while Listen is playing', async ({ page }) => {
    skipWebSpeechPlayingAssertionsInFirefoxCi(page);
    await installSpeechCancelCounter(page);
    await gotoHomeReady(page);
    await openTutorialsPageFromNav(page);
    await openAiTutorialFromTutorialsCard(page);
    await waitAiTutorialMermaidDiagramsStable(page);
    await expect(page.getByTestId('article-listen')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('article-listen').getByRole('button', { name: /Listen/i }).click();
    const toggle = page.getByTestId('article-listen').locator('[data-action="toggle"]');
    await expect.poll(async () => toggle.getAttribute('aria-pressed'), { timeout: 20_000 }).toBe('true');
    const cancelsAfterPlaying = await getListenCancelCount(page);
    await page.locator('a.lesson-back-button.inline-load').click();
    await page.waitForFunction(
      () => document.querySelector('#content')?.getAttribute('data-content-loaded') === 'true',
      { timeout: 15_000 }
    );
    await expect(page.getByTestId('ai-tutorial-spa')).toBeVisible({ timeout: 15_000 });
    await expect
      .poll(async () => getListenCancelCount(page), { timeout: 10_000 })
      .toBeGreaterThan(cancelsAfterPlaying);
  });

  test('ArticleListen.extractSpeakableText strips Mermaid pre source from lesson body', async ({
    page,
  }) => {
    await gotoHomeReady(page);
    await openTutorialsPageFromNav(page);
    await openAiTutorialFromTutorialsCard(page);
    await expect(page.locator('[data-testid="ai-tutorial-guide"]')).toBeVisible({ timeout: 15_000 });

    const extracted = await page.evaluate(() => {
      const w = window as typeof window & {
        ArticleListen?: { extractSpeakableText: (el: Element | null) => string };
      };
      const body = document.querySelector('.lesson-body');
      return w.ArticleListen?.extractSpeakableText(body || null) || '';
    });

    expect(extracted.length).toBeGreaterThan(200);
    expect(extracted).not.toMatch(/flowchart|sequenceDiagram|subgraph|participant\s/i);
    expect(extracted).toMatch(/AI|automation|model/i);
  });
});
