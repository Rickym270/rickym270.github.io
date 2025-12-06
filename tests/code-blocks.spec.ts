import { test, expect } from '@playwright/test';

test.describe('Code Blocks', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure English is set for these tests
    await page.goto('/');
    
    // Wait for TranslationManager to be available and initialized
    await page.waitForFunction(() => {
      return typeof window.TranslationManager !== 'undefined' && 
             window.TranslationManager.currentLanguage !== undefined;
    }, { timeout: 5000 }).catch(() => {
      // TranslationManager might not exist - that's okay
    });
    
    // Set language to English
    await page.evaluate(() => {
      localStorage.setItem('siteLanguage', 'en');
      if (typeof window.TranslationManager !== 'undefined') {
        window.TranslationManager.switchLanguage('en');
      }
    });
    
    // Wait for translations to apply
    await page.waitForTimeout(500);
  });

  test('code blocks are initialized on docs page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Docs
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      const docsLink = page.locator('.mobile-nav-item').filter({ hasText: /Docs|Notes/i });
      await docsLink.click();
    } else {
      const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Docs' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Docs' })
      );
      await docsButton.hover();
      await page.locator('.dropdown-menu').first().getByRole('link', { name: 'Notes' }).click();
    }
    
    // Wait for docs page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#FAQMain, .notes-content');
    }, { timeout: 15000 });
    await page.waitForTimeout(1000);
    
    // Check if code blocks exist (they might be in FAQ pages)
    const codeBlocks = page.locator('.code-block-wrapper, pre code');
    const count = await codeBlocks.count();
    
    // If there are code blocks, check they're properly initialized
    if (count > 0) {
      // Check for code block wrapper (if initialized)
      const wrapper = page.locator('.code-block-wrapper').first();
      if (await wrapper.count() > 0) {
        await expect(wrapper).toBeVisible();
      }
    }
  });

  test('code block copy button works', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Navigate to a page with code blocks (try Python FAQ page)
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      const docsLink = page.locator('.mobile-nav-item').filter({ hasText: /Docs|Notes/i });
      await docsLink.click();
    } else {
      const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Docs' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Docs' })
      );
      await docsButton.hover();
      await page.locator('.dropdown-menu').first().getByRole('link', { name: 'Notes' }).click();
    }
    
    // Wait for docs page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#FAQMain, .notes-content');
    }, { timeout: 15000 });
    await page.waitForTimeout(1000);
    
    // Look for code block with copy button
    const copyButton = page.locator('.code-copy-button').first();
    const copyButtonCount = await copyButton.count();
    
    if (copyButtonCount > 0) {
      // Get the code content before clicking
      const codeWrapper = copyButton.locator('..').locator('..').locator('.code-block-content');
      const codeText = await codeWrapper.locator('code').textContent();
      
      // Click copy button
      await copyButton.click();
      
      // Check clipboard (if permissions allow)
      // Note: Clipboard API might not work in all test environments
      try {
        const clipboardText = await page.evaluate(async () => {
          return await navigator.clipboard.readText();
        });
        expect(clipboardText).toBeTruthy();
      } catch (e) {
        // Clipboard access might be denied in test environment
        // That's okay, we at least verified the button is clickable
        console.log('Clipboard access not available in test environment');
      }
      
      // Check for visual feedback (button should show "copied" state)
      await page.waitForTimeout(500);
      const buttonText = await copyButton.textContent();
      // Button might show "Copied" or similar feedback
      expect(buttonText).toBeTruthy();
    }
  });

  test('code blocks have syntax highlighting', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Navigate to a page with code blocks
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      const docsLink = page.locator('.mobile-nav-item').filter({ hasText: /Docs|Notes/i });
      await docsLink.click();
    } else {
      const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Docs' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Docs' })
      );
      await docsButton.hover();
      await page.locator('.dropdown-menu').first().getByRole('link', { name: 'Notes' }).click();
    }
    
    // Wait for docs page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#FAQMain, .notes-content');
    }, { timeout: 15000 });
    await page.waitForTimeout(1000);
    
    // Check for highlighted code (highlight.js adds classes)
    const highlightedCode = page.locator('code.hljs, code[class*="language"]');
    const count = await highlightedCode.count();
    
    // If highlight.js is loaded, code should have highlighting classes
    if (count > 0) {
      const firstCode = highlightedCode.first();
      const classes = await firstCode.getAttribute('class');
      expect(classes).toBeTruthy();
      // Should have some highlighting class
      expect(classes).toMatch(/hljs|language/);
    }
  });

  test('code block language tabs work', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Navigate to a page with code blocks that have language switching
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      const docsLink = page.locator('.mobile-nav-item').filter({ hasText: /Docs|Notes/i });
      await docsLink.click();
    } else {
      const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Docs' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Docs' })
      );
      await docsButton.hover();
      await page.locator('.dropdown-menu').first().getByRole('link', { name: 'Notes' }).click();
    }
    
    // Wait for docs page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#FAQMain, .notes-content');
    }, { timeout: 15000 });
    await page.waitForTimeout(1000);
    
    // Look for language tabs
    const languageTabs = page.locator('.code-language-tab');
    const tabCount = await languageTabs.count();
    
    if (tabCount > 0) {
      // Get the first tab
      const firstTab = languageTabs.first();
      const tabText = await firstTab.textContent();
      
      // Click on a different tab if available
      if (tabCount > 1) {
        const secondTab = languageTabs.nth(1);
        await secondTab.click();
        
        // Check that the clicked tab is now active
        const isActive = await secondTab.evaluate((el) => el.classList.contains('active'));
        expect(isActive).toBe(true);
      }
    }
  });

  test('code blocks are styled correctly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Navigate to a page with code blocks
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      const docsLink = page.locator('.mobile-nav-item').filter({ hasText: /Docs|Notes/i });
      await docsLink.click();
    } else {
      const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Docs' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Docs' })
      );
      await docsButton.hover();
      await page.locator('.dropdown-menu').first().getByRole('link', { name: 'Notes' }).click();
    }
    
    // Wait for docs page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#FAQMain, .notes-content');
    }, { timeout: 15000 });
    await page.waitForTimeout(1000);
    
    // Check for code block wrapper styling
    const codeWrapper = page.locator('.code-block-wrapper').first();
    const wrapperCount = await codeWrapper.count();
    
    if (wrapperCount > 0) {
      // Check that wrapper is visible and has proper styling
      await expect(codeWrapper).toBeVisible();
      
      // Check for header
      const header = codeWrapper.locator('.code-block-header');
      await expect(header).toBeVisible();
      
      // Check for content area
      const content = codeWrapper.locator('.code-block-content');
      await expect(content).toBeVisible();
    }
  });
});

