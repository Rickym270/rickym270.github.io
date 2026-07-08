import { test, expect } from '@playwright/test';

const QA_PREP_URL = '/p/loop-prep/index.html';

test.describe('[regression] QA Loop Prep (unlisted)', () => {
  test('loads app shell at /p/loop-prep/', async ({ page }) => {
    await page.goto(QA_PREP_URL, {
      waitUntil: 'load',
      timeout: 30_000,
    });

    await expect(page.getByRole('heading', { name: 'QA Loop Prep' })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByRole('button', { name: 'Mock Panel' })).toBeVisible();
  });

  test('topic Train drill shows rubric self-score on compare step', async ({
    page,
  }) => {
    await page.goto(QA_PREP_URL, {
      waitUntil: 'load',
      timeout: 30_000,
    });

    await expect(page.getByRole('heading', { name: 'QA Loop Prep' })).toBeVisible({
      timeout: 20_000,
    });

    // Default topic is selected; advance through drill to compare/rubric step
    await page.getByRole('button', { name: "We've answered" }).click();
    await page.getByRole('button', { name: 'Continue' }).click(); // reflect → reveal
    await page.getByRole('button', { name: 'Continue' }).click(); // reveal → compare

    // On compare, Continue stays disabled until rubric categories are scored
    await expect(page.getByText('Self-Score Your Answer')).toBeVisible({
      timeout: 10_000,
    });
    // Rubric legend: score levels 1, 3, 5
    await expect(page.locator('.rubric-legend__score').first()).toBeVisible();
  });
});
