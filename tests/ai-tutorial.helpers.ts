import type { Page } from '@playwright/test';

/**
 * Shared navigation for AI tutorial E2E tests (SPA from home → Tutorials → AI guide).
 */
export async function gotoHomeReady(page: Page): Promise<void> {
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
}

export async function openTutorialsPageFromNav(page: Page): Promise<void> {
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
}

export async function openAiTutorialFromTutorialsCard(page: Page): Promise<void> {
  await page.getByTestId('ai-tutorial-spa').click();
  await page.waitForFunction(
    () => document.querySelector('#content')?.getAttribute('data-content-loaded') === 'true',
    { timeout: 15_000 }
  );
  await page.getByTestId('ai-tutorial-guide').waitFor({ state: 'visible', timeout: 15_000 });
}

export async function switchSiteLanguage(page: Page, lang: 'en' | 'es'): Promise<void> {
  const isMobile = await page.evaluate(() => window.innerWidth <= 768);
  if (isMobile) {
    const sidebarAlreadyOpen = (await page.locator('#mobile-sidebar.active').count()) > 0;
    // When the drawer is already open (e.g. after SPA nav used the menu), the hamburger sits
    // under the sidebar; clicking it hits .mobile-sidebar-header and times out (CI chromium-iphone).
    if (!sidebarAlreadyOpen) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
    }
    const langBtn = page.locator(`#mobile-language-switcher button[data-lang="${lang}"]`);
    await langBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await langBtn.click();
  } else {
    await page
      .locator(
        `#language-switcher button[data-lang="${lang}"], #language-switcher-medium button[data-lang="${lang}"]`
      )
      .first()
      .click();
  }
  // Allow TranslationManager + optional Mermaid re-init to settle
  await page.waitForTimeout(800);
}
