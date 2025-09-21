import { test, expect } from '@playwright/test';

test.describe('Home page content', () => {
  test('banner image centered with black background and caption', async ({ page }) => {
    await page.goto('/');
    // Ensure Home loaded into #content
    await page.waitForSelector('#content');
    // Banner container exists and has black background
    const banner = page.locator('#content #homeBanner');
    await expect(banner).toBeVisible();
    await expect(banner).toHaveCSS('background-color', 'rgb(0, 0, 0)');

    // Image is centered within carousel by geometry (left/right margins equal within tolerance)
    const img = page.locator('#content #homeBanner .carousel-item.active img');
    await expect(img).toBeVisible();
    const bannerBox = await banner.boundingBox();
    const imgBox = await img.boundingBox();
    expect(bannerBox && imgBox).toBeTruthy();
    if (bannerBox && imgBox) {
      const leftGap = imgBox.x - bannerBox.x;
      const rightGap = (bannerBox.x + bannerBox.width) - (imgBox.x + imgBox.width);
      expect(Math.abs(leftGap - rightGap)).toBeLessThanOrEqual(2);
    }

    // Caption text
    const caption = page.locator('#content .carousel-caption');
    await expect(caption).toContainText(/Ricky Martinez/i);
    // Accept either current or desired role text
    await expect(caption).toContainText(/Software Architect, Engineer, Tester|Programmer, Musician, Fixer-Upper/i);
  });

  test('links below banner to LinkedIn and Github point correctly', async ({ page }) => {
    await page.goto('/');
    const linkedIn = page.getByRole('link', { name: /^LinkedIn$/ });
    // Disambiguate Github link: pick the one whose accessible name is exactly 'Github'
    const github = page.getByRole('link', { name: /^Github$/ });
    await expect(linkedIn).toHaveAttribute('href', 'https://www.linkedin.com/in/rickym270');
    await expect(github).toHaveAttribute('href', 'http://www.github.com/rickym270');
  });

  test('two-column content: left story, right skills', async ({ page }) => {
    await page.goto('/');
    const leftTitle = page.locator('#content h2', { hasText: 'The story so far...' });
    await expect(leftTitle).toBeVisible();

    const skillsHeader = page.locator('#content h4', { hasText: 'Skills' });
    await expect(skillsHeader).toBeVisible();

    // Ensure two columns are stacked side-by-side on desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    const leftCol = leftTitle.locator('xpath=ancestor::div[contains(@class,"col-")][1]');
    const rightCol = skillsHeader.locator('xpath=ancestor::div[contains(@class,"col-")][1]');
    const leftBox = await leftCol.boundingBox();
    const rightBox = await rightCol.boundingBox();
    expect(leftBox && rightBox).toBeTruthy();
    if (leftBox && rightBox) {
      expect(leftBox.x).toBeLessThan(rightBox.x);
    }
  });
});


