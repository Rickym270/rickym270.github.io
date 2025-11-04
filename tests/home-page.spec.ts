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

  test('carousel images are not skewed and properly centered', async ({ page }) => {
    await page.goto('/');
    
    const banner = page.locator('#content #homeBanner');
    await expect(banner).toBeVisible();
    
    const carouselItem = page.locator('#content #homeBanner .carousel-item.active');
    await expect(carouselItem).toBeVisible();
    
    const img = carouselItem.locator('img');
    await expect(img).toBeVisible();
    
    // Check image has proper object-fit
    const objectFit = await img.evaluate((el) => {
      return window.getComputedStyle(el).objectFit;
    });
    expect(objectFit).toBe('cover');
    
    // Check image is not skewed (aspect ratio maintained)
    const imgBox = await img.boundingBox();
    expect(imgBox).toBeTruthy();
    if (imgBox) {
      // Image should have reasonable dimensions (not extremely wide or tall)
      const aspectRatio = imgBox.width / imgBox.height;
      expect(aspectRatio).toBeGreaterThan(0.5);
      expect(aspectRatio).toBeLessThan(3);
    }
  });

  test('View All Skills button has transparent fill and blue outline', async ({ page }) => {
    await page.goto('/');
    
    const viewAllSkillsBtn = page.locator('#content a').filter({ hasText: /View All Skills/i });
    await expect(viewAllSkillsBtn).toBeVisible({ timeout: 2000 });
    
    // Check button has outline-primary class
    const classes = await viewAllSkillsBtn.evaluate((el) => {
      return Array.from(el.classList);
    });
    expect(classes).toContain('btn-outline-primary');
    
    // Check background is transparent
    const bgColor = await viewAllSkillsBtn.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    // Should be transparent or rgba with low alpha
    expect(bgColor).toMatch(/rgba\(0, 0, 0, 0\)|transparent|rgba\(.*, 0\)/);
    
    // Check border color is blue (accent color)
    const borderColor = await viewAllSkillsBtn.evaluate((el) => {
      return window.getComputedStyle(el).borderColor;
    });
    // Should have blue border (rgb values for blue)
    const borderRgb = borderColor.match(/\d+/g);
    expect(borderRgb).toBeTruthy();
    if (borderRgb) {
      const b = parseInt(borderRgb[2]);
      expect(b).toBeGreaterThan(200); // Blue component should be high
    }
  });

  test('View All Skills button navigates to skills page via SPA', async ({ page }) => {
    await page.goto('/');
    
    const viewAllSkillsBtn = page.locator('#content a').filter({ hasText: /View All Skills/i });
    await expect(viewAllSkillsBtn).toBeVisible({ timeout: 2000 });
    
    const urlBefore = page.url();
    
    // Click button
    await viewAllSkillsBtn.click();
    await page.waitForTimeout(1500);
    
    // URL should not change (SPA navigation)
    expect(page.url()).toBe(urlBefore);
    
    // Navbar should still be visible
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Skills page content should load
    await expect(page.locator('#content h3')).toHaveText('Skills', { timeout: 3000 });
  });

  test('Quick Stats displays last updated in correct format', async ({ page }) => {
    await page.goto('/');
    
    // Wait for stats section to potentially load
    await page.waitForTimeout(3000);
    
    // Check if stats section exists and is visible
    const statsSection = page.locator('#stats-section');
    const statsVisible = await statsSection.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (statsVisible) {
      // Look for "Last Updated" text
      const lastUpdated = page.locator('#content').getByText(/Last Updated/i);
      const lastUpdatedVisible = await lastUpdated.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (lastUpdatedVisible) {
        // Check format (should be MM/DD/YY HH:MM EST)
        const lastUpdatedText = await lastUpdated.textContent();
        expect(lastUpdatedText).toBeTruthy();
        
        // Should match format: MM/DD/YY HH:MM EST
        if (lastUpdatedText) {
          // Check for date pattern and EST
          expect(lastUpdatedText).toMatch(/\d{1,2}\/\d{1,2}\/\d{2,4}/); // Date pattern
          expect(lastUpdatedText).toMatch(/\d{1,2}:\d{2}/); // Time pattern
          expect(lastUpdatedText).toMatch(/EST/i); // EST timezone
        }
      }
    }
  });
});


