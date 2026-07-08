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
    await expect(page.getByRole('button', { name: 'Partner' })).toBeVisible();
  });

  test('Partner mode shows question with hidden answers until toggled', async ({
    page,
  }) => {
    await page.goto(QA_PREP_URL, {
      waitUntil: 'load',
      timeout: 30_000,
    });

    await page.getByRole('button', { name: 'Partner' }).click();
    await expect(page.getByRole('heading', { name: 'Partner Mode' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Question' })).toBeVisible();
    await expect(page.getByText('Answers are hidden')).toBeVisible();

    await page.getByRole('checkbox', { name: 'Show answers' }).check();
    await expect(page.getByRole('heading', { name: 'Answer' })).toBeVisible();
    await expect(page.locator('.partner-mode__bullets li').first()).toBeVisible();

    const firstQuestion = await page
      .locator('.partner-mode__question')
      .textContent();
    await page.getByRole('button', { name: 'Next' }).click();
    const secondQuestion = await page
      .locator('.partner-mode__question')
      .textContent();
    expect(secondQuestion).not.toBe(firstQuestion);
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
