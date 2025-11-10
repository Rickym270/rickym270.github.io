import { test, expect } from '@playwright/test';

test.describe('Home page content', () => {
  test('banner image centered with dark background and hero content', async ({ page }) => {
    await page.goto('/');
    // Ensure Home loaded into #content
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    // Banner container exists and has dark background
    const banner = page.locator('#content #homeBanner');
    await expect(banner).toBeVisible();
    // Check for dark background (should be rgb(10, 10, 10) or similar)
    const bgColor = await banner.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(bgColor).toMatch(/rgb\(10, 10, 10\)|rgb\(26, 26, 26\)|rgba\(10, 10, 10/);

    // Hero portrait image exists
    const img = page.locator('#content #homeBanner .hero-portrait');
    await expect(img).toBeVisible();

    // Hero headline text exists
    const headline = page.locator('#content #homeBanner .hero-headline');
    await expect(headline).toBeVisible();
    await expect(headline).toContainText(/RICKY MARTINEZ/i);
    await expect(headline).toContainText(/I'M A DEVELOPER/i);
  });

  test('hero buttons link to LinkedIn and Github correctly', async ({ page }) => {
    await page.goto('/');
    // Wait for content to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    const linkedIn = page.getByRole('link', { name: /Connect on LinkedIn/i });
    const github = page.getByRole('link', { name: /View GitHub/i });
    await expect(linkedIn).toHaveAttribute('href', 'https://www.linkedin.com/in/rickym270');
    await expect(github).toHaveAttribute('href', 'https://github.com/rickym270');
  });

  test('two-column content: left story, right skills', async ({ page }) => {
    await page.goto('/');
    
    // Wait for content to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    const leftTitle = page.locator('#content h2', { hasText: /The story so far|About Me/i });
    await expect(leftTitle).toBeVisible({ timeout: 3000 });

    const skillsHeader = page.locator('#content h2, #content h4').filter({ hasText: /Tech Stack|Skills/i });
    await expect(skillsHeader).toBeVisible({ timeout: 3000 });

    // Ensure two columns are stacked side-by-side on desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(500); // Let layout settle
    
    const leftCol = leftTitle.locator('xpath=ancestor::div[contains(@class,"col-")][1]');
    const rightCol = skillsHeader.locator('xpath=ancestor::div[contains(@class,"col-")][1]');
    const leftBox = await leftCol.boundingBox();
    const rightBox = await rightCol.boundingBox();
    expect(leftBox && rightBox).toBeTruthy();
    if (leftBox && rightBox) {
      expect(leftBox.x).toBeLessThan(rightBox.x);
    }
  });

  test('hero portrait image is properly displayed', async ({ page }) => {
    await page.goto('/');
    
    const banner = page.locator('#content #homeBanner');
    await expect(banner).toBeVisible();
    
    const img = page.locator('#content #homeBanner .hero-portrait');
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
      // Portrait image should have reasonable dimensions (not extremely wide or tall)
      const aspectRatio = imgBox.width / imgBox.height;
      expect(aspectRatio).toBeGreaterThan(0.5);
      expect(aspectRatio).toBeLessThan(2);
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
    
    // Wait for content to load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForTimeout(1000);
    
    const viewAllSkillsBtn = page.locator('#content a').filter({ hasText: /View All Skills/i });
    await expect(viewAllSkillsBtn).toBeVisible({ timeout: 3000 });
    
    const urlBefore = page.url();
    
    // Click button
    await viewAllSkillsBtn.click();
    await page.waitForTimeout(2000);
    
    // URL should not change (SPA navigation)
    expect(page.url()).toBe(urlBefore);
    
    // Navbar should still be visible
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Skills page content should load - check for h1 or h3
    const skillsHeading = page.locator('#content h1, #content h3').filter({ hasText: /^Skills$/ });
    await expect(skillsHeading).toBeVisible({ timeout: 3000 });
    await expect(skillsHeading).toHaveText('Skills', { timeout: 1000 });
  });

  test('Quick Stats displays last updated in correct format', async ({ page }) => {
    await page.goto('/');
    
    // Wait for stats section to potentially load
    await page.waitForTimeout(3000);
    
    // Check if stats section exists and is visible
    const statsSection = page.locator('#stats-section');
    const statsVisible = await statsSection.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (statsVisible) {
      // Look for "Last Updated" text in card-text
      const lastUpdatedLabel = page.locator('#stats-section .card-text', { hasText: /Last Updated/i });
      const lastUpdatedVisible = await lastUpdatedLabel.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (lastUpdatedVisible) {
        // Find the corresponding card-title with the date
        const card = lastUpdatedLabel.locator('xpath=ancestor::div[contains(@class,"card")][1]');
        const dateTitle = card.locator('.card-title');
        await expect(dateTitle).toBeVisible();
        
        const dateText = await dateTitle.textContent();
        expect(dateText).toBeTruthy();
        
        // Should match format: MM/DD/YY HH:MM EST
        if (dateText) {
          // Check for date pattern and EST
          expect(dateText).toMatch(/\d{1,2}\/\d{1,2}\/\d{2,4}/); // Date pattern
          expect(dateText).toMatch(/\d{1,2}:\d{2}/); // Time pattern
          expect(dateText).toMatch(/EST/i); // EST timezone
        }
      }
    }
  });
  
  test('Quick Stats cards have centered content and proper text size', async ({ page }) => {
    await page.goto('/');
    
    // Wait for stats section to potentially load
    await page.waitForTimeout(3000);
    
    const statsSection = page.locator('#stats-section');
    const statsVisible = await statsSection.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (statsVisible) {
      const cards = page.locator('#stats-section .card');
      const cardCount = await cards.count();
      
      if (cardCount > 0) {
        // Check first card for centering and text size
        const firstCard = cards.first();
        const cardBody = firstCard.locator('.card-body');
        const cardTitle = firstCard.locator('.card-title');
        
        await expect(cardBody).toBeVisible();
        await expect(cardTitle).toBeVisible();
        
        // Check text alignment is centered
        const textAlign = await cardBody.evaluate((el) => {
          return window.getComputedStyle(el).textAlign;
        });
        expect(textAlign).toBe('center');
        
        // Check font size is 1.5rem (24px)
        const fontSize = await cardTitle.evaluate((el) => {
          return window.getComputedStyle(el).fontSize;
        });
        // 1.5rem = 24px (assuming 16px base)
        expect(fontSize).toMatch(/24px|1\.5rem/);
        
        // Check flexbox centering
        const display = await cardBody.evaluate((el) => {
          return window.getComputedStyle(el).display;
        });
        expect(display).toBe('flex');
      }
    }
  });
});


