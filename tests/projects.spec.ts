import { test, expect } from '@playwright/test';

test('navigates to Projects via navbar and renders content', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Projects' }).click();
  await expect(page.locator('#content h3')).toHaveText('Projects');
  await expect(page.locator('#content .card .card-title').first()).toContainText(/rickym270.github.io|PythonTutorial|GoPS/i);
});


