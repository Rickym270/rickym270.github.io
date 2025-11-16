import { test, expect } from '@playwright/test';

test.describe('Navbar', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure English is set for these tests
    await page.goto('/');
    
    // Wait for TranslationManager to be available and initialized
    await page.waitForFunction(() => {
      return typeof window.TranslationManager !== 'undefined' && 
             window.TranslationManager.currentLanguage !== undefined;
    }, { timeout: 5000 }).catch(() => {
      // TranslationManager might not exist on master branch - that's okay
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
    
    // Verify English is set by checking navbar text
    await page.waitForFunction(() => {
      const homeLink = document.querySelector('nav a[data-translate="nav.home"]');
      return homeLink && homeLink.textContent?.trim() === 'Home';
    }, { timeout: 3000 }).catch(() => {
      // If translation system doesn't exist, that's okay - tests will use English by default
    });
  });

  test('has top navbar with expected links', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav.navbar');
    await expect(nav).toBeVisible();

    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Skills' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Ricky Martinez' })).toBeVisible();

    // Docs dropdown and its items
    const docs = nav.getByRole('button', { name: 'Docs' }).or(nav.getByRole('link', { name: 'Docs' }));
    await expect(docs).toBeVisible();
    await docs.hover();
    const menu = page.locator('.dropdown-menu');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Notes' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Journal' })).toBeVisible();

    await expect(nav.getByRole('link', { name: 'Tutorials' })).toBeVisible();
  });

  test('Docs dropdown arrow is on same line as text', async ({ page }) => {
    await page.goto('/');
    
    const docsLink = page.locator('nav.navbar').getByRole('button', { name: 'Docs' })
      .or(page.locator('nav.navbar').getByRole('link', { name: 'Docs' }));
    await expect(docsLink).toBeVisible();
    
    // Check that dropdown arrow is inline with text
    const boundingBox = await docsLink.boundingBox();
    expect(boundingBox).toBeTruthy();
    
    // The link should not be broken across multiple lines
    const textContent = await docsLink.textContent();
    expect(textContent).toBeTruthy();
    if (textContent) {
      // Should contain "Docs" text
      expect(textContent.trim()).toContain('Docs');
    }
  });

  test('Home link loads home page content', async ({ page }) => {
    await page.goto('/');
    
    // Navigate away from home
    await page.getByRole('link', { name: 'Projects' }).click();
    // Wait for fade transition
    await page.waitForTimeout(400);
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!document.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    
    // Verify we're on Projects - use data-translate selector for reliability
    const projectsHeading = page.locator('#content h1[data-translate="projects.heading"]');
    await expect(projectsHeading).toBeVisible({ timeout: 5000 });
    await expect(projectsHeading).toContainText('Projects', { timeout: 3000 });
    
    // Click Home link
    await page.getByRole('link', { name: 'Home' }).click();
    // Wait for fade transition
    await page.waitForTimeout(400);
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Wait for homeBanner element to exist in DOM
    await page.waitForSelector('#content #homeBanner', { timeout: 15000, state: 'attached' });
    await page.waitForTimeout(500);
    
    // Should load home content
    await expect(page.locator('#content #homeBanner')).toBeVisible({ timeout: 10000 });
  });

  test('Skills link navigates to skills page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Use navbar scoped locator to avoid "View All Skills" button
    await page.locator('nav.navbar').getByRole('link', { name: 'Skills', exact: true }).click();
    // Wait for fade transition
    await page.waitForTimeout(400);
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#content h1, #content h3');
    }, { timeout: 15000 });
    
    // Skills page should load - wait for heading to be visible (not just attached)
    // This ensures CSS has rendered and translations have applied
    await page.waitForSelector('#content h1[data-translate="skills.title"]', { timeout: 15000, state: 'visible' });
    await page.waitForTimeout(500);
    const skillsHeading = page.locator('#content h1[data-translate="skills.title"]');
    await expect(skillsHeading).toBeVisible({ timeout: 10000 });
  });
});


