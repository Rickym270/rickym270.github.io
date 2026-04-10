import { test, expect, type Page } from '@playwright/test';
import {
  gotoHomeReady,
  openAiTutorialFromTutorialsCard,
  openTutorialsPageFromNav,
} from './ai-tutorial.helpers';

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

    await expect(page.getByTestId('article-listen')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('article-listen').getByRole('button', { name: /Listen/i }).click();

    await expect
      .poll(async () => page.evaluate(() => (window as { __lastSpeakText?: string }).__lastSpeakText || ''))
      .not.toMatch(/flowchart|sequenceDiagram|subgraph|participant\s/i, { timeout: 10_000 });

    const spoken = await page.evaluate(() => (window as { __lastSpeakText?: string }).__lastSpeakText || '');
    expect(spoken.length).toBeGreaterThan(200);
    expect(spoken).toMatch(/AI|automation|model/i);
  });
});
