import { test, expect } from '@playwright/test';

test.describe('Site footer', () => {
  test.describe.configure({ timeout: 60000 });

  test.beforeEach(async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/', { waitUntil: 'load', timeout: 60000 });
  });

  test('footer is present and visible on desktop', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'chromium-iphone', 'Footer is desktop-only (hidden on mobile)');
    const footer = page.locator('#site-footer');
    await expect(footer).toBeVisible();
  });

  test('footer contains identity section', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'chromium-iphone', 'Footer is desktop-only');
    await expect(page.locator('.site-footer__identity').filter({ hasText: 'Ricky Martinez' })).toBeVisible();
    await expect(page.locator('.site-footer__identity').filter({ hasText: 'Senior Automation Engineer' })).toBeVisible();
    await expect(page.locator('.site-footer__identity').filter({ hasText: /automation|accessibility/ })).toBeVisible();
  });

  test('footer theme toggle changes theme and stays in sync', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'chromium-iphone', 'Footer is desktop-only');
    const footerTheme = page.locator('#theme-toggle-footer');
    await expect(footerTheme).toBeVisible();
    const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await footerTheme.click();
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(after).toBeTruthy();
    expect(after).not.toBe(before);
  });

  test('footer language toggle switches language', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'chromium-iphone', 'Footer is desktop-only');
    const esBtn = page.locator('#language-switcher-footer button[data-lang="es"]');
    await expect(esBtn).toBeVisible();
    await esBtn.click();
    await page.waitForTimeout(500);
    const lang = await page.evaluate(() => (window as unknown as { TranslationManager?: { currentLanguage: string } }).TranslationManager?.currentLanguage);
    expect(lang).toBe('es');
  });

  test('reduced motion toggle sets data-reduced-motion and persists', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'chromium-iphone', 'Footer is desktop-only');
    const btn = page.locator('#reduced-motion-toggle');
    await expect(btn).toBeVisible();
    await btn.click();
    await page.waitForTimeout(100);
    const attr = await page.evaluate(() => document.documentElement.getAttribute('data-reduced-motion'));
    expect(attr).toBe('true');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    const afterReload = await page.evaluate(() => document.documentElement.getAttribute('data-reduced-motion'));
    expect(afterReload).toBe('true');
  });

  test('reset preferences restores defaults', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'chromium-iphone', 'Footer is desktop-only');
    await page.locator('#theme-toggle-footer').click();
    await page.waitForTimeout(200);
    await page.locator('#language-switcher-footer button[data-lang="es"]').click();
    await page.waitForTimeout(200);
    await page.locator('#reduced-motion-toggle').click();
    await page.waitForTimeout(200);
    await page.locator('#reset-preferences').click();
    await page.waitForTimeout(500);
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    const lang = await page.evaluate(() => (window as unknown as { TranslationManager?: { currentLanguage: string } }).TranslationManager?.currentLanguage);
    const reduced = await page.evaluate(() => document.documentElement.getAttribute('data-reduced-motion'));
    expect(theme).toBe('light');
    expect(lang).toBe('en');
    expect(reduced).toBe('false');
  });

  test('quick links include GitHub, LinkedIn, Contact, Engineering', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'chromium-iphone', 'Footer is desktop-only');
    const footer = page.locator('.site-footer__links');
    await expect(footer.getByRole('link', { name: 'GitHub' })).toBeVisible();
    await expect(footer.getByRole('link', { name: /^LinkedIn$/ })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Contact' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Engineering' })).toBeVisible();
  });

  test('external links have target _blank and noopener', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'chromium-iphone', 'Footer is desktop-only');
    const github = page.locator('.site-footer__links a[href*="github.com"]');
    await expect(github).toHaveAttribute('target', '_blank');
    await expect(github).toHaveAttribute('rel', /noopener/);
  });

  test('back to top scrolls to top', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'chromium-iphone', 'Footer is desktop-only');
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(200);
    const before = await page.evaluate(() => window.scrollY);
    expect(before).toBeGreaterThan(0);
    await page.locator('#footer-back-to-top').click();
    await expect(async () => {
      const y = await page.evaluate(() => window.scrollY);
      expect(y).toBe(0);
    }).toPass({ timeout: 3000 });
  });

  test('footer theme and language controls are focusable', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'chromium-iphone', 'Footer is desktop-only');
    const themeBtn = page.locator('#theme-toggle-footer');
    const enBtn = page.locator('#language-switcher-footer button[data-lang="en"]');
    await themeBtn.focus();
    await expect(themeBtn).toBeFocused();
    await enBtn.focus();
    await expect(enBtn).toBeFocused();
  });

  test('footer is hidden on mobile viewport', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-iphone', 'Only run on mobile project');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'load', timeout: 60000 });
    const footer = page.locator('#site-footer');
    await expect(footer).toBeHidden();
  });
});
