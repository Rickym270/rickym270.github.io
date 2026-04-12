import type { Page } from '@playwright/test';

/**
 * `waitUntil` for SPA `page.goto` in Playwright tests.
 * Do not use `networkidle` for Firefox (or generally) in CI — it often never completes on this SPA
 * (see docs/Post-Mortem/ci-firefox-page-goto-networkidle-timeout.md).
 */
export function spaGotoWaitUntil(): 'domcontentloaded' {
  return 'domcontentloaded';
}

/**
 * Optional bounded quiet-network wait after navigation (e.g. performance specs).
 * Never blocks indefinitely; ignores timeout/failure.
 */
export async function tryWaitNetworkIdleBounded(page: Page, ms: number): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout: ms }).catch(() => {});
}

/**
 * Home `/` loaded and SPA #content ready (banner or data-content-loaded).
 */
/**
 * Call before clicking an SPA link that loads an HTML fragment; await the returned promise
 * (with `.catch(() => {})` if cache may skip the request), then use existing DOM readiness waits.
 * @see docs/Post-Mortem/ci-chromium-iphone-spa-flakiness.md
 */
export function waitForSpaHtmlFragmentResponse(page: Page, urlSubstring: string, timeout = 8000) {
  return page.waitForResponse(
    (res) => res.url().includes(urlSubstring) && (res.status() === 200 || res.status() === 304),
    { timeout }
  );
}

export async function gotoHomeReady(page: Page): Promise<void> {
  const waitUntil = spaGotoWaitUntil();
  await page.goto('/', {
    waitUntil,
    timeout: 60_000,
  });

  await page.waitForFunction(
    () => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    },
    { timeout: 15_000 }
  );
}
