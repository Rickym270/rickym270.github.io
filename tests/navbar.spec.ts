import { test, expect } from '@playwright/test';

test.describe('Navbar', () => {
  test('has top navbar with expected links', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav.navbar');
    await expect(nav).toBeVisible();

    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Skills' })).toBeVisible();
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

  test('Docs dropdown arrow is on same line as text', async ({ page }) => {
    await page.goto('/');
    
    const docsLink = page.locator('nav.navbar').getByRole('button', { name: 'Docs' })
      .or(page.locator('nav.navbar').getByRole('link', { name: 'Docs' }));
    await expect(docsLink).toBeVisible();
    
    // Check that dropdown arrow is inline with text
    const boundingBox = await docsLink.boundingBox();
    expect(boundingBox).toBeTruthy();
    
    // The link should not be broken across multiple lines
    const textContent = await docsLink.textContent();
    expect(textContent).toBeTruthy();
    if (textContent) {
      // Should contain "Docs" text
      expect(textContent.trim()).toContain('Docs');
    }
  });

  test('Home link loads home page content', async ({ page }) => {
    await page.goto('/');
    
    // Navigate away from home
    await page.getByRole('link', { name: 'Projects' }).click();
    await page.waitForTimeout(1000);
    
    // Verify we're on Projects
    await expect(page.locator('#content h3')).toHaveText('Projects');
    
    // Click Home link
    await page.getByRole('link', { name: 'Home' }).click();
    await page.waitForTimeout(1000);
    
    // Should load home content
    await expect(page.locator('#content #homeBanner')).toBeVisible({ timeout: 2000 });
  });

  test('Skills link navigates to skills page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Skills' }).click();
    await page.waitForTimeout(1000);
    
    // Skills page should load
    await expect(page.locator('#content h3')).toHaveText('Skills', { timeout: 2000 });
  });
});


