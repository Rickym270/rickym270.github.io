import { test, expect } from '@playwright/test';

test('loads Home content on initial load', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('#content h3');
  await expect(page.locator('#content h3').first()).toHaveText(/Ricky Martinez/i);
  await expect(page.getByRole('link', { name: /^LinkedIn$/ })).toBeVisible();
});


