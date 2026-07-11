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
    await expect(page.getByRole('button', { name: 'Interviewee', pressed: true })).toBeVisible();
    await expect(
      page.getByText("You're practicing as the interviewee")
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Answer — grade points covered' })
    ).not.toBeVisible();

    await page.getByRole('button', { name: 'Interviewer' }).click();
    await expect(page.getByRole('button', { name: 'Interviewer', pressed: true })).toBeVisible();
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

    await page.getByRole('button', { name: 'Interviewer' }).click();
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

    await page.getByRole('button', { name: 'Interviewer' }).click();
    await expect(page.locator('.partner-mode__question-sticky')).toBeVisible();
    await expect(page.locator('.partner-point-checklist__item').first()).toBeVisible();

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth + 1;
    });
    expect(overflow).toBe(false);
  });

  test('topic Train drill shows attempt-first question shell', async ({ page }) => {
    await page.goto(QA_PREP_URL, {
      waitUntil: 'load',
      timeout: 30_000,
    });

    await expect(page.getByRole('heading', { name: 'QA Loop Prep' })).toBeVisible({
      timeout: 20_000,
    });

    await expect(page.getByRole('heading', { name: 'Interview Question' })).toBeVisible();
    await expect(
      page.getByPlaceholder('Type your answer before revealing the model response…')
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit Answer' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Give Me One Hint' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reveal Model Answer' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next question' })).toBeVisible();
    await expect(
      page.getByText('Model answer hidden until you reveal or submit.')
    ).toBeVisible();
  });

  test('Train mode fits mobile viewport without horizontal overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(QA_PREP_URL, {
      waitUntil: 'load',
      timeout: 30_000,
    });

    await expect(page.getByRole('heading', { name: 'Interview Question' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit Answer' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next question' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ask study helper' })).toBeVisible();

    await page.getByRole('button', { name: 'Ask study helper' }).click();
    await expect(page.getByRole('heading', { name: 'Study helper' })).toBeVisible();

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth + 1;
    });
    expect(overflow).toBe(false);
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

  test('attempt-first drill submits answer and shows evaluation', async ({
    page,
  }) => {
    await page.route('**/api/qa-prep/attempt-coach', async (route) => {
      const body = route.request().postDataJSON() as { action: string };

      if (body.action === 'evaluate') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            scores: {
              technicalAccuracy: 8,
              qaReasoning: 7,
              riskAnalysis: 7,
              completeness: 7,
              communication: 8,
              healthcareDomainAwareness: 7,
            },
            strengths: ['Named effective-date boundaries'],
            missed: ['Commercial vs Medicare split'],
            inaccuracies: [],
            structureTips: 'Lead with the highest-risk scenario first.',
            lengthFeedback: 'appropriately detailed',
            comparison: [
              {
                area: 'Plan split',
                myAnswer: 'Medicare only',
                modelAnswer: 'Medicare + commercial',
                gap: 'critical omission',
              },
            ],
            modelAnswer: {
              concise60to90: 'Test before, on, and after the effective date...',
              detailedStrategy: 'Layer regression across eligibility flags and SQL checks.',
              conceptChecklist: [
                {
                  concept: 'Effective date',
                  whyItMatters: 'Wrong cohort can block members from medication.',
                },
              ],
            },
            reinforcement: {
              question:
                'Commercial members became ineligible after a formulary update — how would you investigate?',
              referenceAnswer: 'Compare plan mapping and staging data.',
            },
            technicallyCorrect: true,
            highRiskCovered: true,
            masteryEligible: true,
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ hint: 'Think about before and after the effective date.' }),
      });
    });

    await page.goto(QA_PREP_URL, {
      waitUntil: 'load',
      timeout: 30_000,
    });

    await expect(page.getByRole('heading', { name: 'Interview Question' })).toBeVisible();
    await page
      .getByPlaceholder('Type your answer before revealing the model response…')
      .fill('I would regression test eligibility before and after the effective date for Medicare members.');
    await page.getByRole('button', { name: 'Submit Answer' }).click();

    await expect(page.getByRole('heading', { name: 'Your evaluation' })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText('Named effective-date boundaries')).toBeVisible();
    await expect(page.getByText('Test before, on, and after the effective date')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Try reinforcement question' })
    ).toBeVisible();
  });

  test('study helper opens panel, sends question, and shows reply', async ({
    page,
  }) => {
    await page.route('**/api/qa-prep/study-chat', async (route) => {
      const request = route.request();
      const body = request.postDataJSON() as {
        messages: { role: string; content: string }[];
        context: { topicTitle: string };
      };

      expect(body.messages.at(-1)?.content).toContain('eligibility boundary');
      expect(body.context.topicTitle).toBeTruthy();

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          reply: 'Start with contract checks, then integration paths for edge cases.',
          model: 'gpt-4o-mini',
        }),
      });
    });

    await page.goto(QA_PREP_URL, {
      waitUntil: 'load',
      timeout: 30_000,
    });

    await expect(page.getByRole('button', { name: 'Ask study helper' })).toBeVisible();
    await page.getByRole('button', { name: 'Ask study helper' }).click();
    await expect(page.getByRole('heading', { name: 'Study helper' })).toBeVisible();

    await page
      .getByPlaceholder('Ask about this topic…')
      .fill('How do I answer the eligibility boundary question?');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(
      page.getByText('Start with contract checks, then integration paths for edge cases.')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Minimize' }).click();
    await expect(page.getByRole('heading', { name: 'Study helper' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Interview Question' })).toBeVisible();
  });
});
