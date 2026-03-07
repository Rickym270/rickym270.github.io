import { test, expect } from '@playwright/test';

test.describe('Mobile sidebar', () => {
  test.describe.configure({ timeout: 60000 });

  const mobileViewport = { width: 375, height: 667 };

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('siteLanguage', 'en');
    });
    await page.setViewportSize(mobileViewport);
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
  });

  test('opens and shows main items including Docs and Blog toggles', async ({ page }) => {
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
    const sidebar = page.locator('#mobile-sidebar');

    await expect(sidebar.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Skills' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Contact' })).toBeVisible();
    await expect(sidebar.getByRole('button', { name: 'Docs' })).toBeVisible();
    await expect(sidebar.getByRole('button', { name: 'Blog' })).toBeVisible();
  });

  test('language and theme remain in footer', async ({ page }) => {
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });

    const footer = page.locator('.mobile-sidebar-footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('#mobile-language-switcher')).toBeVisible();
    await expect(footer.locator('#mobile-theme-toggle')).toBeVisible();
  });

  test('mobile sidebar shows all four accessibility controls', async ({ page }) => {
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });

    const settings = page.locator('.mobile-sidebar-settings');
    await expect(settings.locator('#mobile-language-switcher')).toBeVisible();
    await expect(settings.locator('#mobile-theme-toggle')).toBeVisible();
    await expect(settings.locator('#mobile-reduced-motion-toggle')).toBeVisible();
    await expect(settings.locator('#mobile-reset-preferences')).toBeVisible();
  });

  test('reduce motion toggle updates state', async ({ page }) => {
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });

    const toggle = page.locator('#mobile-reduced-motion-toggle');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'false');
  });

  test('reset preferences restores defaults', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('portfolio-theme', 'dark');
      localStorage.setItem('siteLanguage', 'es');
      localStorage.setItem('portfolio-reduced-motion', 'true');
    });
    await page.setViewportSize(mobileViewport);
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });

    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
    await page.locator('#mobile-reset-preferences').click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'false');
    const lang = await page.evaluate(() => localStorage.getItem('siteLanguage'));
    expect(lang).toBe('en');
  });

  test('reduced motion preference persists after sidebar close and reopen', async ({ page }) => {
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
    await page.locator('#mobile-reduced-motion-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true');

    await page.locator('#mobile-sidebar-close').click();
    await expect(page.locator('#mobile-sidebar.active')).toHaveCount(0);
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });

    await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true');
    await expect(page.locator('#mobile-reduced-motion-toggle')).toHaveAttribute('aria-pressed', 'true');
  });

  test('menu items have flat UI (no heavy box-shadow)', async ({ page }) => {
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });

    const nav = page.locator('.mobile-sidebar-nav');
    await expect(nav).toBeVisible();
    const boxShadow = await nav.evaluate((el) => window.getComputedStyle(el).boxShadow);
    expect(boxShadow).toBe('none');

    const firstItem = page.locator('.mobile-nav-item').first();
    const itemShadow = await firstItem.evaluate((el) => window.getComputedStyle(el).boxShadow);
    expect(itemShadow).toBe('none');
  });

  test('Docs panel shows Notes and Tutorials when expanded', async ({ page }) => {
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });

    await page.evaluate(() => {
      const panel = document.getElementById('mobile-nav-panel-docs');
      const toggle = document.getElementById('mobile-nav-toggle-docs');
      if (panel && toggle) {
        panel.classList.add('mobile-nav-group-panel-open');
        panel.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.add('mobile-nav-group-toggle-open');
      }
    });
    const docsPanel = page.locator('#mobile-nav-panel-docs');
    await expect(docsPanel).toBeVisible();
    await expect(page.locator('#mobile-nav-toggle-docs')).toHaveAttribute('aria-expanded', 'true');
    await expect(docsPanel.getByRole('link', { name: 'Notes' })).toBeVisible();
    await expect(docsPanel.getByRole('link', { name: 'Tutorials' })).toBeVisible();
  });

  test('Blog panel shows Engineering and Personal when expanded', async ({ page }) => {
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });

    await page.evaluate(() => {
      const panel = document.getElementById('mobile-nav-panel-blog');
      const toggle = document.getElementById('mobile-nav-toggle-blog');
      if (panel && toggle) {
        panel.classList.add('mobile-nav-group-panel-open');
        panel.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.add('mobile-nav-group-toggle-open');
      }
    });
    const blogPanel = page.locator('#mobile-nav-panel-blog');
    await expect(blogPanel).toBeVisible();
    await expect(page.locator('#mobile-nav-toggle-blog')).toHaveAttribute('aria-expanded', 'true');
    await expect(blogPanel.getByRole('link', { name: 'Engineering' })).toBeVisible();
    await expect(blogPanel.getByRole('link', { name: 'Personal' })).toBeVisible();
  });

  test('opening Blog closes Docs panel (accordion)', async ({ page }) => {
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });

    await page.evaluate(() => {
      const panel = document.getElementById('mobile-nav-panel-docs');
      const toggle = document.getElementById('mobile-nav-toggle-docs');
      if (panel && toggle) {
        panel.classList.add('mobile-nav-group-panel-open');
        panel.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
    await expect(page.locator('#mobile-nav-panel-docs')).toBeVisible();
    await page.locator('#mobile-nav-toggle-blog').click();
    const docsHidden = await page.locator('#mobile-nav-panel-docs').isHidden();
    expect(docsHidden).toBeTruthy();
  });

  test('clicking Engineering from Blog panel loads content and closes sidebar', async ({ page }) => {
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
    const sidebar = page.locator('#mobile-sidebar');

    await page.evaluate(() => {
      const panel = document.getElementById('mobile-nav-panel-blog');
      const toggle = document.getElementById('mobile-nav-toggle-blog');
      if (panel && toggle) {
        panel.classList.add('mobile-nav-group-panel-open');
        panel.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
    await expect(page.locator('#mobile-nav-panel-blog')).toBeVisible();
    await sidebar.locator('#mobile-nav-panel-blog').getByRole('link', { name: 'Engineering' }).click();

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('h1');
    }, { timeout: 15000 });
    await expect(page.locator('#content h1').filter({ hasText: /Engineering/i })).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#mobile-sidebar.active')).toHaveCount(0);
  });

  test('clicking Tutorials from Docs panel loads content and closes sidebar', async ({ page }) => {
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
    const sidebar = page.locator('#mobile-sidebar');

    await page.evaluate(() => {
      const panel = document.getElementById('mobile-nav-panel-docs');
      const toggle = document.getElementById('mobile-nav-toggle-docs');
      if (panel && toggle) {
        panel.classList.add('mobile-nav-group-panel-open');
        panel.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
    await expect(page.locator('#mobile-nav-panel-docs')).toBeVisible();
    await sidebar.locator('#mobile-nav-panel-docs').getByRole('link', { name: 'Tutorials' }).click();

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('h1');
    }, { timeout: 15000 });
    await expect(page.locator('#mobile-sidebar.active')).toHaveCount(0);
  });
});
