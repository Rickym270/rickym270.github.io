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
    await expect(page.getByRole('button', { name: 'Hiring Loop' })).toBeVisible();
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
    await expect(page.locator('.partner-mode__progress')).toHaveText(
      /Question 1 of (1[0-8]|[1-9])/
    );
    await expect(page.getByRole('heading', { name: 'Question' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Show grading script' })
    ).toBeVisible();
    await expect(page.getByText('Tap')).toBeVisible();

    await page.getByRole('button', { name: 'Show grading script' }).click();
    await expect(
      page.getByRole('heading', { name: 'Answer — grade points covered' })
    ).toBeVisible();
    await expect(page.locator('.partner-grade-score')).toHaveText(
      /0 \/ \d+ points · 0%/
    );

    await page
      .locator('.partner-point-checklist__item input[type="checkbox"]')
      .first()
      .check();
    await expect(page.locator('.partner-grade-score')).toHaveText(
      /1 \/ \d+ points · \d+%/
    );

    const firstQuestion = await page
      .locator('.partner-mode__question')
      .textContent();
    await page.getByRole('button', { name: 'Next' }).click();
    const secondQuestion = await page
      .locator('.partner-mode__question')
      .textContent();
    expect(secondQuestion).not.toBe(firstQuestion);
    await expect(page.locator('.partner-grade-score')).toHaveText(
      /0 \/ \d+ points · 0%/
    );

    await page.getByRole('button', { name: 'Shuffle' }).click();
    await expect(page.locator('.partner-mode__progress')).toHaveText(
      /Question 1 of/
    );
    const afterShuffle = await page
      .locator('.partner-mode__question')
      .textContent();
    expect(afterShuffle?.length).toBeGreaterThan(0);
  });

  test('Partner mode session nav jumps to selected question', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(QA_PREP_URL, {
      waitUntil: 'load',
      timeout: 30_000,
    });

    await page.getByRole('button', { name: 'Partner' }).click();
    await expect(page.getByRole('heading', { name: 'Partner Mode' })).toBeVisible();

    const sessionItems = page.locator('.partner-session-nav__item');
    await expect(sessionItems).toHaveCount(18);

    await sessionItems.nth(2).click();
    await expect(page.locator('.partner-mode__progress')).toHaveText(/Question 3 of 18/);

    await page.getByRole('button', { name: 'Show grading script' }).click();
    await expect(page.locator('.partner-mode__question-sticky')).toContainText(
      /Question 3 of 18/
    );
    await expect(
      page.getByRole('heading', { name: 'Answer — grade points covered' })
    ).toBeVisible();
  });

  test('Partner mode uses desktop layout on wide viewport', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium',
      'Desktop layout check runs on chromium only'
    );

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(QA_PREP_URL, {
      waitUntil: 'load',
      timeout: 30_000,
    });

    await page.getByRole('button', { name: 'Partner' }).click();
    await expect(page.getByRole('heading', { name: 'Partner Mode' })).toBeVisible();

    const layout = await page.evaluate(() => {
      const main = document.querySelector('.app-main');
      const header = document.querySelector('.partner-mode__header');
      const nav = document.querySelector('.partner-mode__nav');
      const controls = document.querySelector('.partner-mode__controls');
      if (!main || !header || !nav || !controls) return null;
      const mainStyle = getComputedStyle(main);
      const headerStyle = getComputedStyle(header);
      const navStyle = getComputedStyle(nav);
      const controlsStyle = getComputedStyle(controls);
      return {
        mainColumns: mainStyle.gridTemplateColumns,
        headerDirection: headerStyle.flexDirection,
        navDirection: navStyle.flexDirection,
        controlsDisplay: controlsStyle.display,
        partnerWidth: document.querySelector('.partner-mode')?.clientWidth ?? 0,
        isFullWidthMain: main.classList.contains('app-main--panel'),
      };
    });

    expect(layout).not.toBeNull();
    expect(layout!.isFullWidthMain).toBe(true);
    expect(layout!.mainColumns.split(/\s+/).length).toBe(1);
    expect(layout!.headerDirection).toBe('row');
    expect(layout!.navDirection).toBe('row');
    expect(layout!.controlsDisplay).toBe('flex');
    expect(layout!.partnerWidth).toBeGreaterThan(600);
  });

  test('Partner mode fits mobile viewport without horizontal overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(QA_PREP_URL, {
      waitUntil: 'load',
      timeout: 30_000,
    });

    await page.getByRole('button', { name: 'Partner' }).click();
    await expect(page.getByRole('heading', { name: 'Partner Mode' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Shuffle' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();

    await page.getByRole('checkbox', { name: 'Show answers' }).check();
    await expect(page.locator('.partner-mode__question-sticky')).toBeVisible();
    await expect(page.locator('.partner-point-checklist__item').first()).toBeVisible();

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth + 1;
    });
    expect(overflow).toBe(false);
  });

  test('topic Train drill shows story rec and rubric on compare step', async ({
    page,
  }) => {
    await page.goto(QA_PREP_URL, {
      waitUntil: 'load',
      timeout: 30_000,
    });

    await expect(page.getByRole('heading', { name: 'QA Loop Prep' })).toBeVisible({
      timeout: 20_000,
    });

    await expect(
      page.getByRole('heading', { name: 'Recommended story — lead with this' })
    ).toBeVisible();

    await page.getByRole('button', { name: "We've answered" }).click();

    const nextFollowUp = page.getByRole('button', { name: 'Next follow-up' });
    for (let i = 0; i < 5; i++) {
      if (!(await nextFollowUp.isVisible())) break;
      await nextFollowUp.click();
    }

    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Self-Score Your Answer')).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.locator('.rubric-legend__score').first()).toBeVisible();
  });

  test('Hiring Loop picker shows three round themes', async ({ page }) => {
    await page.goto(QA_PREP_URL, { waitUntil: 'load', timeout: 30_000 });
    await page.getByRole('button', { name: 'Hiring Loop' }).click();
    await expect(page.getByRole('heading', { name: 'Hiring Loop' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Backend QA — Vivek Mugunthan/ })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Debugging & Technical Reasoning — Clinton Anderson/ })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Behavioral & Collaboration — Raghu Tayanna/ })
    ).toBeVisible();
  });
});
