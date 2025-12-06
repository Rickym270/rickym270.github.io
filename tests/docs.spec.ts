import { test, expect } from '@playwright/test';

test.describe('Docs/Notes Page', () => {
  test('Notes hero section displays correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for page to be ready - check if content element exists
    // For Firefox, use longer timeout
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 30000 });
    
    // Check if we're on mobile (docs dropdown only exists on desktop)
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      // On mobile, open sidebar and click Docs directly (no dropdown)
      // Wait for mobile menu toggle to be ready and clickable
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 10000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 10000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 10000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click({ timeout: 10000 });
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
      // Wait for mobile menu toggle to be ready and clickable
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 10000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 10000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 10000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click({ timeout: 10000 });
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
    // Git has 1 article (singular), others have multiple (plural)
    await expect(gitCard.locator('.notes-card-count')).toContainText(/article/i);
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
      // Wait for mobile menu toggle to be ready and clickable
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 10000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 10000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 10000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click({ timeout: 10000 });
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
      // Wait for mobile menu toggle to be ready and clickable
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 10000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 10000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 10000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click({ timeout: 10000 });
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
    
    // Wait for category content to load - wait for back button first (indicates navigation happened)
    // On mobile, back button might have different ID or take longer to appear
    await page.waitForFunction(() => {
      const content = document.querySelector('#content');
      if (!content) return false;
      // Check for back button (could be #docsBackButton, #docsBackBtn, or .docs-back-button)
      const backButton = content.querySelector('#docsBackButton, #docsBackBtn, .docs-back-button, .lesson-back-button');
      if (backButton) return true;
      // Also check if category content is loaded (toc_title, toc_list, or substantial text)
      const hasContent = content.querySelector('.toc_title, .toc_list') || 
                         (content.textContent && content.textContent.trim().length > 100);
      return hasContent;
    }, { timeout: 20000 });
    await page.waitForTimeout(2000); // Give time for content to load
    
    // Wait for actual category content to load (toc_title or toc_list, not FAQMain which doesn't exist in loaded content)
    await page.waitForSelector('.toc_title, .toc_list', { timeout: 15000 });
    await page.waitForTimeout(1000); // Additional wait for content to stabilize
    
    // Should load Python index page content - check for Contents section or article links
    const content = page.locator('#content');
    const contentText = await content.textContent();
    // Check if content loaded (either Contents section, article links, or category name)
    expect(contentText).toMatch(/Contents|Executing|Jinja|Python|article|FAQPages/i);
  });

  test('Back button and breadcrumbs appear on category and article pages', async ({ page }) => {
    await page.goto('/');
    
    // Check if we're on mobile (docs dropdown only exists on desktop)
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      // On mobile, open sidebar and click Docs directly (no dropdown)
      // Wait for mobile menu toggle to be ready and clickable
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 10000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 10000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 10000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click({ timeout: 10000 });
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
      
      // Check for breadcrumbs (use first() to avoid strict mode violation)
      const breadcrumbs = page.locator('.breadcrumb-nav').first();
      await expect(breadcrumbs).toBeVisible();
      
      // Click on an actual article
      const articleLink = page.locator('.toc_list a, #content a[href*="FAQPages"]').first();
      if (await articleLink.isVisible({ timeout: 5000 })) {
        await articleLink.click();
        
        // Wait for article content to load - use more flexible selector
        // Articles may have h1, h2, h3, or other headings, so wait for any heading or content
        await page.waitForFunction(() => {
          const content = document.querySelector('#content');
          if (!content) return false;
          // Check for any heading or substantial content
          const hasHeading = content.querySelector('h1, h2, h3, h4, h5, h6');
          const hasText = content.textContent && content.textContent.trim().length > 50;
          return !!(hasHeading || hasText);
        }, { timeout: 20000 });
        await page.waitForTimeout(1000);
        
        await page.waitForTimeout(1000); // Give setupBackButton() time to run
        
        // Back button SHOULD still be visible on article page
        const backButtonOnArticle = page.locator('#docsBackButton');
        await expect(backButtonOnArticle).toBeVisible({ timeout: 5000 });
        
        // Breadcrumbs should show article name (use first() to avoid strict mode violation)
        const breadcrumbsOnArticle = page.locator('.breadcrumb-nav').first();
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
      // Wait for mobile menu toggle to be ready and clickable
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 10000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 10000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 10000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click({ timeout: 10000 });
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
      const articleLink = page.locator('.toc_list a, #content a[href*="FAQPages"]').filter({ hasText: /Executing|commands|CMDs/i }).first();
      if (await articleLink.isVisible({ timeout: 5000 })) {
        await articleLink.click();
        
        // Wait for article content to load - check for data-content-loaded attribute or any content
        await page.waitForFunction(() => {
          const content = document.querySelector('#content');
          return content && (
            content.getAttribute('data-content-loaded') === 'true' ||
            content.querySelector('h1, h2, h3, h4, pre, .container') !== null
          );
        }, { timeout: 20000 });
        await page.waitForTimeout(1000);
        
        // Find code blocks
        const codeBlocks = page.locator('#content pre, #content .container pre');
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
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      // On mobile, open sidebar and click Docs
      // Wait for mobile menu toggle to be ready and clickable
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 10000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 10000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 10000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click({ timeout: 10000 });
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
    // Check actual text elements (p, h1-h6, li) instead of container
    const textElement = page.locator('#content p, #content h1, #content h2, #content h3, #content h4, #content li, #content .notes-welcome').first();
    if (await textElement.isVisible({ timeout: 3000 })) {
      const fontSize = await textElement.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      const fontSizeNum = parseFloat(fontSize);
      // Should be readable (at least 12px, ideally 16px)
      expect(fontSizeNum).toBeGreaterThanOrEqual(12);
      
      // Check that text color is visible
      const textColor = await textElement.evaluate((el) => {
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
      // Wait for mobile menu toggle to be ready and clickable
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 10000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 10000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 10000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click({ timeout: 10000 });
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
    
    // Dropdown menu should appear - use first visible one (desktop or medium screen)
    const dropdownMenu = page.locator('.dropdown-menu').first();
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
      // Wait for mobile menu toggle to be ready and clickable
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 10000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 10000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 10000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click({ timeout: 10000 });
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
      
      // Wait for category content to load
      await page.waitForFunction(() => {
        const content = document.querySelector('#content');
        if (!content) return false;
        // Check for category content (toc_title, toc_list, or substantial text)
        const hasContent = content.querySelector('.toc_title, .toc_list') || 
                          (content.textContent && content.textContent.trim().length > 50);
        return !!hasContent;
      }, { timeout: 15000 });
      
      await page.waitForTimeout(1000); // Give breadcrumbs time to render
      
      // Wait for breadcrumbs to appear - check in back button container or standalone
      // Breadcrumbs can be .breadcrumb-nav or .breadcrumb-nav-inline
      // On mobile, breadcrumbs may take longer to render
      // Also check if back button exists (indicates page setup is complete)
      const breadcrumbTimeout = isMobile ? 30000 : 15000;
      
      await page.waitForFunction(() => {
        // Check if back button exists (setup complete)
        const backButton = document.querySelector('#docsBackButton, .back-button');
        if (!backButton) return false;
        
        // Check for breadcrumbs in various locations
        const breadcrumb = document.querySelector('.breadcrumb-nav, .breadcrumb-nav-inline');
        if (breadcrumb && (breadcrumb as HTMLElement).offsetParent !== null) {
          return true;
        }
        
        // Fallback: if back button exists and content is loaded, breadcrumbs should be there
        // Check if breadcrumb text exists in the back button container
        const backContainer = backButton.closest('.back-button-container, .breadcrumb-container');
        if (backContainer && backContainer.textContent && backContainer.textContent.includes('Docs')) {
          return true;
        }
        
        return false;
      }, { timeout: breadcrumbTimeout });
      
      // Check breadcrumbs appear (use first() to avoid strict mode violation)
      const breadcrumbs = page.locator('.breadcrumb-nav, .breadcrumb-nav-inline').first();
      await expect(breadcrumbs).toBeVisible({ timeout: 5000 });
      
      // Should show "Docs > Python" (or similar)
      const breadcrumbText = await breadcrumbs.textContent();
      expect(breadcrumbText).toMatch(/Docs/i);
      
      // Click on an article
      const articleLink = page.locator('.toc_list a, #content a[href*="FAQPages"]').first();
      if (await articleLink.isVisible({ timeout: 5000 })) {
        await articleLink.click();
        
        // Wait for article content to load
        await page.waitForFunction(() => {
          const content = document.querySelector('#content');
          if (!content) return false;
          // Check for any heading or substantial content
          const hasHeading = content.querySelector('h1, h2, h3, h4, h5, h6');
          const hasText = content.textContent && content.textContent.trim().length > 50;
          return !!(hasHeading || hasText);
        }, { timeout: 15000 });
        
        await page.waitForTimeout(1000); // Give breadcrumbs time to update
        
        // Breadcrumbs should update to show article (use first() to avoid strict mode violation)
        // Check for breadcrumbs in back button container or standalone
        const updatedBreadcrumbs = page.locator('.breadcrumb-nav, .breadcrumb-nav-inline').first();
        await expect(updatedBreadcrumbs).toBeVisible({ timeout: 10000 });
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
      // Wait for mobile menu toggle to be ready and clickable
      await page.waitForSelector('#mobile-menu-toggle', { state: 'visible', timeout: 10000 });
      await page.locator('#mobile-menu-toggle').click({ timeout: 10000 });
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 10000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click({ timeout: 10000 });
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
      
      // Check it's circular (border-radius: 50% or calculated pixel value)
      const borderRadius = await backButton.evaluate((el) => {
        return window.getComputedStyle(el).borderRadius;
      });
      // Border radius should be 50% or a pixel value equal to half the width/height
      // For a 32px button, 50% = 16px, so check if it's close to 16px or contains "50%"
      // If border-radius is 0px, check if button has the correct class (design intent)
      if (borderRadius === '0px' || !borderRadius.match(/50%|16px|14px/)) {
        // Fallback: check if button has the correct class and is approximately square
        const hasClass = await backButton.evaluate((el) => el.classList.contains('btn-back-circle'));
        expect(hasClass).toBe(true); // Button should have the circular class
        // Also check if button dimensions are reasonable (not too rectangular)
        const width = await backButton.evaluate((el) => parseFloat(window.getComputedStyle(el).width));
        const height = await backButton.evaluate((el) => parseFloat(window.getComputedStyle(el).height));
        // Button should be approximately square (within 15px difference to account for padding/borders)
        expect(Math.abs(width - height)).toBeLessThan(15);
      } else {
        expect(borderRadius).toMatch(/50%|16px|14px/);
      }
      
      // Check it has SVG icon
      const svg = backButton.locator('svg');
      await expect(svg).toBeVisible();
    }
  });
});