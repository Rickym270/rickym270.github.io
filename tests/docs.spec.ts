import { test, expect } from '@playwright/test';

test.describe('Docs/Notes Page', () => {
  test('Back button appears only on article pages, not on index pages', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Docs > Notes
    await page.getByRole('button', { name: 'Docs' }).or(page.getByRole('link', { name: 'Docs' })).hover();
    await page.getByRole('link', { name: 'Notes' }).click();
    await page.waitForTimeout(1000);
    
    // Should see initial message or index page
    const initialMessage = page.locator('#FAQMain').getByText(/Click any FAQ|Notes/i);
    await expect(initialMessage.first()).toBeVisible({ timeout: 2000 });
    
    // Back button should NOT be visible on index/initial page
    const backButton = page.locator('#docsNavigatrior');
    const backButtonVisible = await backButton.isVisible({ timeout: 1000 }).catch(() => false);
    expect(backButtonVisible).toBeFalsy();
    
    // Click on a category (e.g., Python)
    const pythonLink = page.locator('#FAQLinks a').filter({ hasText: /Python/i }).first();
    if (await pythonLink.isVisible({ timeout: 2000 })) {
      await pythonLink.click();
      await page.waitForTimeout(1000);
      
      // Back button should still NOT be visible on index/TOC page
      const backButtonAfterToc = page.locator('#docsNavigatrior');
      const backButtonVisibleAfterToc = await backButtonAfterToc.isVisible({ timeout: 1000 }).catch(() => false);
      expect(backButtonVisibleAfterToc).toBeFalsy();
      
      // Click on an actual article
      const articleLink = page.locator('#FAQMain a').first();
      if (await articleLink.isVisible({ timeout: 2000 })) {
        await articleLink.click();
        await page.waitForTimeout(1500);
        
        // Now Back button SHOULD be visible
        const backButtonOnArticle = page.locator('#docsNavigatrior');
        await expect(backButtonOnArticle).toBeVisible({ timeout: 2000 });
        
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

  test('code snippets are single spaced with proper indentation', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Docs > Notes > Python (or any category with code)
    await page.getByRole('button', { name: 'Docs' }).or(page.getByRole('link', { name: 'Docs' })).hover();
    await page.getByRole('link', { name: 'Notes' }).click();
    await page.waitForTimeout(1000);
    
    // Try to find and click an article with code
    const pythonLink = page.locator('#FAQLinks a').filter({ hasText: /Python/i }).first();
    if (await pythonLink.isVisible({ timeout: 2000 })) {
      await pythonLink.click();
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
    
    // Navigate to Docs
    await page.getByRole('button', { name: 'Docs' }).or(page.getByRole('link', { name: 'Docs' })).hover();
    await page.getByRole('link', { name: 'Notes' }).click();
    await page.waitForTimeout(1000);
    
    // Check that text has proper font size (not tiny)
    const container = page.locator('#FAQMain .container');
    if (await container.isVisible({ timeout: 2000 })) {
      const fontSize = await container.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      const fontSizeNum = parseFloat(fontSize);
      // Should be readable (at least 12px, ideally 16px)
      expect(fontSizeNum).toBeGreaterThanOrEqual(12);
    }
    
    // Check that text color is visible
    const textColor = await container.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    // Should not be transparent
    expect(textColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('dropdown menu stays visible on hover', async ({ page }) => {
    await page.goto('/');
    
    const docsButton = page.getByRole('button', { name: 'Docs' }).or(page.getByRole('link', { name: 'Docs' }));
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
    await expect(dropdownMenu.getByRole('link', { name: 'Journal' })).toBeVisible();
  });
});

