import { test, expect } from '@playwright/test';

test.describe('Docs/Notes Page', () => {
  test('Notes hero section displays correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check if we're on mobile (docs dropdown only exists on desktop)
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      // On mobile, open sidebar and click Docs directly (no dropdown)
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click();
    } else {
      // Desktop: use navbar scoped selector for Docs dropdown
      const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Docs' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Docs' })
      );
      await docsButton.hover();
      await page.getByRole('link', { name: 'Notes' }).click();
    }
    await page.waitForTimeout(1000);
    
    // Check hero section elements
    await expect(page.locator('.notes-hero')).toBeVisible();
    await expect(page.locator('.notes-hero-title')).toBeVisible();
    await expect(page.locator('.notes-hero-subtitle')).toBeVisible();
    await expect(page.locator('.notes-hero-icon')).toBeVisible();
  });

  test('Category cards display with correct content', async ({ page }) => {
    await page.goto('/');
    
    // Check if we're on mobile (docs dropdown only exists on desktop)
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      // On mobile, open sidebar and click Docs directly (no dropdown)
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click();
    } else {
      // Desktop: use navbar scoped selector for Docs dropdown
      const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Docs' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Docs' })
      );
      await docsButton.hover();
      await page.getByRole('link', { name: 'Notes' }).click();
    }
    await page.waitForTimeout(1000);
    
    // Check that all three category cards exist
    const categoryCards = page.locator('.notes-category-card');
    await expect(categoryCards).toHaveCount(3);
    
    // Check Python card
    const pythonCard = page.locator('.notes-category-card.python');
    await expect(pythonCard).toBeVisible();
    await expect(pythonCard.locator('.notes-card-title')).toContainText('Python');
    await expect(pythonCard.locator('.notes-card-description')).toBeVisible();
    await expect(pythonCard.locator('.notes-card-count')).toContainText('articles');
    await expect(pythonCard.locator('.notes-card-icon')).toBeVisible();
    
    // Check Git card
    const gitCard = page.locator('.notes-category-card.git');
    await expect(gitCard).toBeVisible();
    await expect(gitCard.locator('.notes-card-title')).toContainText('Git');
    await expect(gitCard.locator('.notes-card-description')).toBeVisible();
    await expect(gitCard.locator('.notes-card-count')).toContainText('articles');
    await expect(gitCard.locator('.notes-card-icon')).toBeVisible();
    
    // Check Misc card
    const miscCard = page.locator('.notes-category-card.misc');
    await expect(miscCard).toBeVisible();
    await expect(miscCard.locator('.notes-card-title')).toContainText('Misc');
    await expect(miscCard.locator('.notes-card-description')).toBeVisible();
    await expect(miscCard.locator('.notes-card-count')).toContainText('articles');
    await expect(miscCard.locator('.notes-card-icon')).toBeVisible();
  });

  test('Welcome message displays correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check if we're on mobile (docs dropdown only exists on desktop)
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      // On mobile, open sidebar and click Docs directly (no dropdown)
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click();
    } else {
      // Desktop: use navbar scoped selector for Docs dropdown
      const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Docs' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Docs' })
      );
      await docsButton.hover();
      await page.getByRole('link', { name: 'Notes' }).click();
    }
    await page.waitForTimeout(1000);
    
    // Check welcome message
    await expect(page.locator('.notes-welcome')).toBeVisible();
    await expect(page.locator('.notes-welcome h4')).toBeVisible();
  });

  test('Category card navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check if we're on mobile (docs dropdown only exists on desktop)
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      // On mobile, open sidebar and click Docs directly (no dropdown)
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click();
    } else {
      // Desktop: use navbar scoped selector for Docs dropdown
      const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Docs' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Docs' })
      );
      await docsButton.hover();
      await page.getByRole('link', { name: 'Notes' }).click();
    }
    await page.waitForTimeout(1000);
    
    // Click on Python category card
    const pythonCard = page.locator('.notes-category-card.python');
    await pythonCard.click();
    await page.waitForTimeout(1000);
    
    // Should load Python index page content
    await expect(page.locator('#FAQMain')).toContainText(/Python|Executing Commands|Jinja/i);
  });

  test('Back button appears only on article pages, not on index pages', async ({ page }) => {
    await page.goto('/');
    
    // Check if we're on mobile (docs dropdown only exists on desktop)
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      // On mobile, open sidebar and click Docs directly (no dropdown)
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click();
    } else {
      // Desktop: use navbar scoped selector for Docs dropdown
      const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Docs' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Docs' })
      );
      await docsButton.hover();
      await page.getByRole('link', { name: 'Notes' }).click();
    }
    await page.waitForTimeout(1000);
    
    // Back button should NOT be visible on initial page
    const backButton = page.locator('#docsNavigatrior');
    const backButtonVisible = await backButton.isVisible({ timeout: 1000 }).catch(() => false);
    expect(backButtonVisible).toBeFalsy();
    
    // Click on a category (e.g., Python)
    const pythonCard = page.locator('.notes-category-card.python');
    if (await pythonCard.isVisible({ timeout: 2000 })) {
      await pythonCard.click();
      await page.waitForTimeout(1000);
      
      // Back button should still NOT be visible on index/TOC page
      const backButtonAfterToc = page.locator('#docsNavigatrior');
      const backButtonVisibleAfterToc = await backButtonAfterToc.isVisible({ timeout: 1000 }).catch(() => false);
      expect(backButtonVisibleAfterToc).toBeFalsy();
      
      // Click on an actual article
      const articleLink = page.locator('#FAQMain a').first();
      if (await articleLink.isVisible({ timeout: 2000 })) {
        await articleLink.click();
        
        // Wait for article content to load via AJAX
        // The back button is part of the dynamically loaded content
        await page.waitForSelector('#docsNavigatrior', { timeout: 10000, state: 'attached' });
        await page.waitForTimeout(500); // Give setupBackButton() time to run
        
        // Now Back button SHOULD be visible
        const backButtonOnArticle = page.locator('#docsNavigatrior');
        await expect(backButtonOnArticle).toBeVisible({ timeout: 5000 });
        
        // Back button should work
        const backLink = backButtonOnArticle.locator('a');
        await expect(backLink).toBeVisible();
        await expect(backLink).toHaveText(/Back/i);
        
        // Click back
        await backLink.click();
        await page.waitForTimeout(1000);
        
        // Should return to index/TOC (Back button hidden again)
        const backButtonAfterBack = page.locator('#docsNavigatrior');
        const backButtonVisibleAfterBack = await backButtonAfterBack.isVisible({ timeout: 1000 }).catch(() => false);
        expect(backButtonVisibleAfterBack).toBeFalsy();
      }
    }
  });

  test('hover effects work on desktop', async ({ page }) => {
    await page.goto('/');
    
    // Skip on mobile - hover effects don't apply
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      test.skip();
    }
    
    // Desktop: navigate to docs
    const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Docs' }).or(
      page.locator('#navbar-links').getByRole('link', { name: 'Docs' })
    );
    await docsButton.hover();
    await page.getByRole('link', { name: 'Notes' }).click();
    await page.waitForTimeout(1000);
    
    // Test hover effect on Python card
    const pythonCard = page.locator('.notes-category-card.python');
    await expect(pythonCard).toBeVisible();
    
    // Hover over the card
    await pythonCard.hover();
    await page.waitForTimeout(200);
    
    // Card should have hover styles applied (transform, shadow, etc.)
    const transform = await pythonCard.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    // Should have some transform applied (translateY)
    expect(transform).not.toBe('none');
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // On mobile, open sidebar and click Docs
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
    await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click();
    await page.waitForTimeout(1000);
    
    // Check that category grid is single column on mobile
    const categoryGrid = page.locator('.notes-category-grid');
    await expect(categoryGrid).toBeVisible();
    
    // Check that cards are stacked vertically (single column)
    const cards = page.locator('.notes-category-card');
    await expect(cards).toHaveCount(3);
    
    // All cards should be visible
    for (let i = 0; i < 3; i++) {
      await expect(cards.nth(i)).toBeVisible();
    }
  });

  test('code snippets are single spaced with proper indentation', async ({ page }) => {
    await page.goto('/');
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      // On mobile, open sidebar and click Docs
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click();
    } else {
      // Desktop: use navbar scoped selector
      const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Docs' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Docs' })
      );
      await docsButton.hover();
      await page.getByRole('link', { name: 'Notes' }).click();
    }
    await page.waitForTimeout(1000);
    
    // Try to find and click an article with code
    const pythonCard = page.locator('.notes-category-card.python');
    if (await pythonCard.isVisible({ timeout: 2000 })) {
      await pythonCard.click();
      await page.waitForTimeout(1000);
      
      // Find an article link (e.g., "Executing commands")
      const articleLink = page.locator('#FAQMain a').filter({ hasText: /Executing|commands|CMDs/i }).first();
      if (await articleLink.isVisible({ timeout: 2000 })) {
        await articleLink.click();
        await page.waitForTimeout(1500);
        
        // Find code blocks
        const codeBlocks = page.locator('#FAQMain pre');
        const codeBlockCount = await codeBlocks.count();
        
        if (codeBlockCount > 0) {
          const firstCodeBlock = codeBlocks.first();
          await expect(firstCodeBlock).toBeVisible();
          
          // Check line-height is 1 (single spacing)
          const lineHeight = await firstCodeBlock.evaluate((el) => {
            return window.getComputedStyle(el).lineHeight;
          });
          // Line height should be close to font-size (single spacing)
          const fontSize = await firstCodeBlock.evaluate((el) => {
            return window.getComputedStyle(el).fontSize;
          });
          const fontSizeNum = parseFloat(fontSize);
          const lineHeightNum = parseFloat(lineHeight);
          
          // Line height should be approximately equal to font size (single spacing)
          expect(lineHeightNum).toBeLessThanOrEqual(fontSizeNum * 1.1);
          
          // Check indentation (padding-left should be significant)
          const paddingLeft = await firstCodeBlock.evaluate((el) => {
            return window.getComputedStyle(el).paddingLeft;
          });
          const paddingLeftNum = parseFloat(paddingLeft);
          expect(paddingLeftNum).toBeGreaterThan(20); // Should have indentation
        }
      }
    }
  });

  test('text in docs is visible and readable', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForTimeout(500);
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      // On mobile, open sidebar and click Docs
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click();
    } else {
      // Desktop: use navbar scoped selector
      const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Docs' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Docs' })
      );
      await docsButton.hover();
      await page.waitForTimeout(300);
      await page.getByRole('link', { name: 'Notes' }).click();
    }
    await page.waitForTimeout(1500);
    
    // Check that text has proper font size (not tiny)
    const container = page.locator('#FAQMain .container, #FAQMain');
    if (await container.first().isVisible({ timeout: 3000 })) {
      const firstContainer = container.first();
      const fontSize = await firstContainer.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      const fontSizeNum = parseFloat(fontSize);
      // Should be readable (at least 12px, ideally 16px)
      expect(fontSizeNum).toBeGreaterThanOrEqual(12);
      
      // Check that text color is visible
      const textColor = await firstContainer.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      // Should not be transparent
      expect(textColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('dropdown menu stays visible on hover', async ({ page }) => {
    await page.goto('/');
    
    // Skip on mobile - dropdown menu doesn't exist
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      test.skip();
    }
    
    // Desktop: use navbar scoped selector
    const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Docs' }).or(
      page.locator('#navbar-links').getByRole('link', { name: 'Docs' })
    );
    await expect(docsButton).toBeVisible();
    
    // Hover over Docs
    await docsButton.hover();
    await page.waitForTimeout(200);
    
    // Dropdown menu should appear
    const dropdownMenu = page.locator('.dropdown-menu');
    await expect(dropdownMenu).toBeVisible();
    
    // Move mouse to menu (simulate moving from button to menu)
    await dropdownMenu.hover();
    await page.waitForTimeout(500);
    
    // Menu should still be visible
    await expect(dropdownMenu).toBeVisible();
    
    // Menu items should be visible
    await expect(dropdownMenu.getByRole('link', { name: 'Notes' })).toBeVisible();
  });
});