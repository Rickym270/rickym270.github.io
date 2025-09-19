import { test, expect } from '@playwright/test';

test.describe('Navbar', () => {
  test('has top navbar with expected links', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav.navbar');
    await expect(nav).toBeVisible();

    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Ricky Martinez' })).toBeVisible();

    // Docs dropdown and its items
    const docs = nav.getByRole('button', { name: 'Docs' }).or(nav.getByRole('link', { name: 'Docs' }));
    await expect(docs).toBeVisible();
    await docs.hover();
    const menu = page.locator('.dropdown-menu');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Notes' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Journal' })).toBeVisible();

    await expect(nav.getByRole('link', { name: 'Tutorials' })).toBeVisible();
  });
});


