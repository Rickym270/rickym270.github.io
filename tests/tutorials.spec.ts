import { test, expect } from '@playwright/test';

test.describe('Tutorials Page', () => {
  test('tutorials page loads without redirecting entire page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForTimeout(500);
    
    const initialUrl = page.url();
    
    // Click Tutorials link
    await page.getByRole('link', { name: 'Tutorials' }).click();
    
    // Wait for content to load
    await page.waitForTimeout(1500);
    
    // Verify we're still on the same page (URL shouldn't change)
    expect(page.url()).toBe(initialUrl);
    
    // Verify navbar is still visible (page didn't redirect)
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Verify tutorials content loaded into #content - check for h1 title
    await expect(page.locator('#content h1')).toHaveText('Tutorials', { timeout: 3000 });
    
    // Verify tutorial cards are visible
    const tutorialCards = page.locator('.tutorial-card');
    await expect(tutorialCards.first()).toBeVisible({ timeout: 2000 });
  });

  test('tutorial cards display correctly with icons and links', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Tutorials page
    await page.getByRole('link', { name: 'Tutorials' }).click();
    await page.waitForTimeout(1500);
    
    // Verify Python Tutorial card exists
    const pythonCard = page.locator('.tutorial-card').filter({ hasText: /Python Tutorial/i }).first();
    await expect(pythonCard).toBeVisible({ timeout: 2000 });
    
    // Verify icon is present
    const pythonIcon = pythonCard.locator('.tutorial-icon-text');
    await expect(pythonIcon).toBeVisible();
    
    // Verify link exists
    const pythonLink = pythonCard.locator('a.tutorial-link');
    await expect(pythonLink).toBeVisible();
    await expect(pythonLink).toContainText(/View Lessons/i);
  });

  test('Python tutorial index page loads with lesson cards', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Tutorials
    await page.getByRole('link', { name: 'Tutorials' }).click();
    await page.waitForTimeout(1500);
    
    // Click Python Tutorial link
    const pythonLink = page.locator('a.tutorial-link').filter({ hasText: /View Lessons/i }).first();
    if (await pythonLink.isVisible({ timeout: 2000 })) {
      await pythonLink.click();
      await page.waitForTimeout(2000);
      
      // Verify lesson index page loaded
      await expect(page.locator('#content h1')).toHaveText('Python Tutorial', { timeout: 3000 });
      
      // Verify introduction section is visible
      const introSection = page.locator('.introduction-section');
      await expect(introSection).toBeVisible({ timeout: 2000 });
      
      // Verify lesson cards are present
      const lessonCards = page.locator('.lesson-card');
      const cardCount = await lessonCards.count();
      expect(cardCount).toBeGreaterThan(0);
      
      // Verify at least one lesson card has a link
      const firstLessonLink = lessonCards.first().locator('a.lesson-card-link');
      await expect(firstLessonLink).toBeVisible();
    }
  });

  test('lesson pages load with back button and navigation', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Tutorials
    await page.getByRole('link', { name: 'Tutorials' }).click();
    await page.waitForTimeout(1500);
    
    // Navigate to Python tutorial index
    const pythonLink = page.locator('a.tutorial-link').filter({ hasText: /View Lessons/i }).first();
    if (await pythonLink.isVisible({ timeout: 2000 })) {
      await pythonLink.click();
      await page.waitForTimeout(2000);
      
      // Click on first lesson card
      const firstLessonCard = page.locator('.lesson-card').first();
      const lessonLink = firstLessonCard.locator('a.lesson-card-link');
      
      if (await lessonLink.isVisible({ timeout: 2000 })) {
        await lessonLink.click();
        await page.waitForTimeout(2000);
        
        // Verify lesson page loaded
        const lessonTitle = page.locator('.lesson-title');
        await expect(lessonTitle).toBeVisible({ timeout: 3000 });
        
        // Verify back button is visible at top
        const backButton = page.locator('.lesson-back-button');
        await expect(backButton).toBeVisible({ timeout: 2000 });
        await expect(backButton).toContainText(/Back to Table of Contents/i);
        
        // Verify navigation links at bottom
        const navBottom = page.locator('.lesson-nav-bottom');
        await expect(navBottom).toBeVisible();
      }
    }
  });

  test('back button navigates to lesson index', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Tutorials -> Python Tutorial -> First Lesson
    await page.getByRole('link', { name: 'Tutorials' }).click();
    await page.waitForTimeout(1500);
    
    const pythonLink = page.locator('a.tutorial-link').filter({ hasText: /View Lessons/i }).first();
    if (await pythonLink.isVisible({ timeout: 2000 })) {
      await pythonLink.click();
      await page.waitForTimeout(2000);
      
      const firstLessonLink = page.locator('.lesson-card').first().locator('a.lesson-card-link');
      if (await firstLessonLink.isVisible({ timeout: 2000 })) {
        await firstLessonLink.click();
        await page.waitForTimeout(2000);
        
        // Click back button
        const backButton = page.locator('.lesson-back-button');
        if (await backButton.isVisible({ timeout: 2000 })) {
          await backButton.click();
          await page.waitForTimeout(2000);
          
          // Verify we're back at lesson index
          await expect(page.locator('#content h1')).toHaveText('Python Tutorial', { timeout: 3000 });
          
          // Verify lesson cards are visible again
          const lessonCards = page.locator('.lesson-card');
          await expect(lessonCards.first()).toBeVisible();
        }
      }
    }
  });

  test('lesson navigation links work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Tutorials -> Python Tutorial -> Introduction
    await page.getByRole('link', { name: 'Tutorials' }).click();
    await page.waitForTimeout(1500);
    
    const pythonLink = page.locator('a.tutorial-link').filter({ hasText: /View Lessons/i }).first();
    if (await pythonLink.isVisible({ timeout: 2000 })) {
      await pythonLink.click();
      await page.waitForTimeout(2000);
      
      // Find Introduction card
      const introCard = page.locator('.lesson-card').filter({ hasText: /Introduction/i }).first();
      if (await introCard.isVisible({ timeout: 2000 })) {
        const introLink = introCard.locator('a.lesson-card-link');
        await introLink.click();
        await page.waitForTimeout(2000);
        
        // Verify introduction page loaded
        await expect(page.locator('.lesson-title')).toContainText(/Introduction/i, { timeout: 3000 });
        
        // Check for Next Lesson link
        const nextLink = page.locator('.lesson-nav-link').filter({ hasText: /Next|→/i }).first();
        if (await nextLink.isVisible({ timeout: 2000 })) {
          await nextLink.click();
          await page.waitForTimeout(2000);
          
          // Verify next lesson loaded
          const lessonTitle = page.locator('.lesson-title');
          await expect(lessonTitle).toBeVisible({ timeout: 3000 });
          await expect(lessonTitle).not.toContainText(/Introduction/i);
        }
      }
    }
  });

  test('tutorial page text and links are visible and clickable', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Tutorials
    await page.getByRole('link', { name: 'Tutorials' }).click();
    await page.waitForTimeout(1000);
    
    // Verify description text is visible
    const description = page.locator('#content').getByText(/Directory of all tutorials/i);
    await expect(description).toBeVisible();
    
    // Verify tutorial cards have visible links
    const tutorialLinks = page.locator('a.tutorial-link');
    const linkCount = await tutorialLinks.count();
    if (linkCount > 0) {
      const firstLink = tutorialLinks.first();
      await expect(firstLink).toBeVisible();
      
      // Check link color is visible (not transparent)
      const linkColor = await firstLink.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      expect(linkColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });
});
