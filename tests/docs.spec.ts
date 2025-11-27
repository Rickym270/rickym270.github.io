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
    
    // Check that all category cards exist (Python, Git, Misc, and Notion)
    const categoryCards = page.locator('.notes-category-card');
    await expect(categoryCards).toHaveCount(4);
    
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
    
    // Click on Python category "View More" link (not the card itself)
    const pythonCard = page.locator('.notes-category-card.python');
    const viewMoreLink = pythonCard.locator('.notes-card-link');
    await expect(viewMoreLink).toBeVisible();
    await viewMoreLink.click();
    
    // Wait for category content to load
    await page.waitForTimeout(1500);
    
    // Should load Python index page content (Contents section with article links)
    await expect(page.locator('#FAQMain')).toContainText(/Contents|Executing|Jinja|Python/i);
  });

  test('Back button and breadcrumbs appear on category and article pages', async ({ page }) => {
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
    const backButton = page.locator('#docsBackButton');
    const backButtonVisible = await backButton.isVisible({ timeout: 1000 }).catch(() => false);
    expect(backButtonVisible).toBeFalsy();
    
    // Click on a category "View More" link (e.g., Python)
    const pythonCard = page.locator('.notes-category-card.python');
    if (await pythonCard.isVisible({ timeout: 2000 })) {
      const viewMoreLink = pythonCard.locator('.notes-card-link');
      await expect(viewMoreLink).toBeVisible();
      await viewMoreLink.click();
      
      // Wait for category content to load
      await page.waitForTimeout(1500);
      
      // Wait for back button and breadcrumbs to appear
      await page.waitForSelector('#docsBackButton', { timeout: 5000 });
      
      // Back button SHOULD be visible on category index page
      const backButtonAfterCategory = page.locator('#docsBackButton');
      await expect(backButtonAfterCategory).toBeVisible({ timeout: 3000 });
      
      // Check for circular back button
      const backBtn = page.locator('#docsBackBtn');
      await expect(backBtn).toBeVisible();
      
      // Check for breadcrumbs
      const breadcrumbs = page.locator('.breadcrumb-nav');
      await expect(breadcrumbs).toBeVisible();
      
      // Click on an actual article
      const articleLink = page.locator('#FAQMain a, .toc_list a').first();
      if (await articleLink.isVisible({ timeout: 2000 })) {
        await articleLink.click();
        
        // Wait for article content to load via AJAX
        await page.waitForFunction(() => {
          const faqMain = document.querySelector('#FAQMain');
          if (!faqMain) return false;
          // Wait for article content (h3 heading or container with content)
          return !!faqMain.querySelector('h3, .container') || faqMain.textContent?.trim().length > 0;
        }, { timeout: 15000 });
        
        await page.waitForTimeout(1000); // Give setupBackButton() time to run
        
        // Back button SHOULD still be visible on article page
        const backButtonOnArticle = page.locator('#docsBackButton');
        await expect(backButtonOnArticle).toBeVisible({ timeout: 5000 });
        
        // Breadcrumbs should show article name
        const breadcrumbsOnArticle = page.locator('.breadcrumb-nav');
        await expect(breadcrumbsOnArticle).toBeVisible();
        
        // Click back button
        const backBtnOnArticle = page.locator('#docsBackBtn');
        await expect(backBtnOnArticle).toBeVisible();
        await backBtnOnArticle.click();
        await page.waitForTimeout(1500);
        
        // Should return to category index (Back button still visible)
        const backButtonAfterBack = page.locator('#docsBackButton');
        await expect(backButtonAfterBack).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('hover effects work on desktop (flat UI)', async ({ page }) => {
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
    
    // Test hover effect on Python card (flat UI - border color change, no transform)
    const pythonCard = page.locator('.notes-category-card.python');
    await expect(pythonCard).toBeVisible();
    
    // Get initial border color
    const initialBorderColor = await pythonCard.evaluate((el) => {
      return window.getComputedStyle(el).borderColor;
    });
    
    // Hover over the card
    await pythonCard.hover();
    await page.waitForTimeout(200);
    
    // Card should have hover styles applied (border color change for flat UI)
    const hoverBorderColor = await pythonCard.evaluate((el) => {
      return window.getComputedStyle(el).borderColor;
    });
    // Border color should change on hover (to accent color)
    expect(hoverBorderColor).not.toBe(initialBorderColor);
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
    await expect(cards).toHaveCount(4); // Python, Git, Misc, and Notion
    
    // All cards should be visible
    for (let i = 0; i < 4; i++) {
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
      // Click "View More" link, not the card itself
      const viewMoreLink = pythonCard.locator('.notes-card-link');
      await viewMoreLink.click();
      await page.waitForTimeout(1500);
      
      // Find an article link (e.g., "Executing commands")
      const articleLink = page.locator('#FAQMain a, .toc_list a').filter({ hasText: /Executing|commands|CMDs/i }).first();
      if (await articleLink.isVisible({ timeout: 2000 })) {
        await articleLink.click();
        
        // Wait for article content to load via AJAX
        await page.waitForFunction(() => {
          const faqMain = document.querySelector('#FAQMain');
          if (!faqMain) return false;
          // Wait for article content (h3, pre, or container with content)
          return !!faqMain.querySelector('h3, pre, .container') || faqMain.textContent?.trim().length > 0;
        }, { timeout: 15000 });
        
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

  test('notes CSS styling is properly applied', async ({ page }) => {
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
    
    // Check that notes.css styles are applied (flat UI)
    const heroSection = page.locator('.notes-hero');
    await expect(heroSection).toBeVisible();
    
    // Check hero has flat background (no gradient in flat UI)
    const heroBackground = await heroSection.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        background: styles.background,
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage
      };
    });
    // Flat UI: should have solid background color, no gradient
    expect(heroBackground.backgroundImage).toBe('none');
    expect(heroBackground.backgroundColor).toBeTruthy();
    
    // Check category cards have flat UI styling (border-radius: 0)
    const pythonCard = page.locator('.notes-category-card.python');
    const cardBorderRadius = await pythonCard.evaluate((el) => {
      return window.getComputedStyle(el).borderRadius;
    });
    // Flat UI: border-radius should be 0
    expect(parseFloat(cardBorderRadius)).toBe(0);
    
    // Check card has transition property for border color change
    const cardTransition = await pythonCard.evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });
    expect(cardTransition).toContain('border-color');
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

  test('breadcrumbs navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click();
    } else {
      const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Docs' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Docs' })
      );
      await docsButton.hover();
      await page.getByRole('link', { name: 'Notes' }).click();
    }
    await page.waitForTimeout(1000);
    
    // Click on a category "View More" link
    const pythonCard = page.locator('.notes-category-card.python');
    if (await pythonCard.isVisible({ timeout: 2000 })) {
      const viewMoreLink = pythonCard.locator('.notes-card-link');
      await viewMoreLink.click();
      await page.waitForTimeout(1500);
      
      // Wait for breadcrumbs to appear
      await page.waitForSelector('.breadcrumb-nav', { timeout: 5000 });
      
      // Check breadcrumbs appear
      const breadcrumbs = page.locator('.breadcrumb-nav');
      await expect(breadcrumbs).toBeVisible();
      
      // Should show "Docs > Python" (or similar)
      const breadcrumbText = await breadcrumbs.textContent();
      expect(breadcrumbText).toMatch(/Docs/i);
      
      // Click on an article
      const articleLink = page.locator('#FAQMain a, .toc_list a').first();
      if (await articleLink.isVisible({ timeout: 2000 })) {
        await articleLink.click();
        await page.waitForTimeout(1500);
        
        // Breadcrumbs should update to show article
        const updatedBreadcrumbs = page.locator('.breadcrumb-nav');
        await expect(updatedBreadcrumbs).toBeVisible();
        const updatedText = await updatedBreadcrumbs.textContent();
        expect(updatedText).toMatch(/Docs/i);
      }
    }
  });

  test('circular back button displays correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click();
    } else {
      const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Docs' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Docs' })
      );
      await docsButton.hover();
      await page.getByRole('link', { name: 'Notes' }).click();
    }
    await page.waitForTimeout(1000);
    
    // Click on a category "View More" link
    const pythonCard = page.locator('.notes-category-card.python');
    if (await pythonCard.isVisible({ timeout: 2000 })) {
      const viewMoreLink = pythonCard.locator('.notes-card-link');
      await viewMoreLink.click();
      await page.waitForTimeout(1500);
      
      // Wait for back button to appear
      await page.waitForSelector('#docsBackBtn', { timeout: 5000 });
      
      // Check for circular back button
      const backButton = page.locator('#docsBackBtn');
      await expect(backButton).toBeVisible();
      
      // Check it's circular (border-radius: 50%)
      const borderRadius = await backButton.evaluate((el) => {
        return window.getComputedStyle(el).borderRadius;
      });
      expect(borderRadius).toMatch(/50%/);
      
      // Check it has SVG icon
      const svg = backButton.locator('svg');
      await expect(svg).toBeVisible();
    }
  });
});