import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ page }) => {
    // Set consistent viewport for visual tests
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Set language to English for consistency
    await page.addInitScript(() => {
      localStorage.setItem('siteLanguage', 'en');
    });
  });

  test('home page matches visual baseline', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for content to load
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Take screenshot of the entire page
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      maxDiffPixels: 100, // Allow small differences (fonts, rendering)
    });
  });

  test('home page hero section matches baseline', async ({ page }) => {
    // Firefox needs networkidle for reliable navigation
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    const timeout = browserName === 'firefox' ? 60000 : 20000;
    await page.goto('/', { waitUntil, timeout });
    
    // Wait for content to load
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Screenshot of hero section only
    const hero = page.locator('#homeBanner, .hero-section, #content > section:first-child').first();
    await expect(hero).toHaveScreenshot('home-hero.png', {
      maxDiffPixels: 50,
    });
  });

  test('navbar matches visual baseline', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for navbar to be visible
    await page.waitForSelector('nav, #navbar, .navbar', { timeout: 10000 });
    
    // Screenshot of navbar
    const navbar = page.locator('nav, #navbar, .navbar').first();
    await expect(navbar).toHaveScreenshot('navbar.png', {
      maxDiffPixels: 50,
    });
  });

  test('projects page matches visual baseline', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for initial content
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    
    // Navigate to projects
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
    
    // Wait for projects to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#ProjInProgress, #ProjComplete');
    }, { timeout: 15000 });
    
    // Screenshot of projects page
    await expect(page).toHaveScreenshot('projects-page.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('contact form matches visual baseline', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for initial content
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    
    // Navigate to contact
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first().click();
    }
    
    // Wait for contact form to load
    await page.waitForSelector('#contact-form, form', { timeout: 15000 });
    
    // Screenshot of contact form
    const form = page.locator('#contact-form, form').first();
    await expect(form).toHaveScreenshot('contact-form.png', {
      maxDiffPixels: 50,
    });
  });

  test('dark mode matches visual baseline', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for content to load
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Toggle to dark mode
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('#mobile-theme-toggle, [data-theme-toggle]').click();
      await page.waitForTimeout(500); // Wait for theme transition
    } else {
      await page.locator('#theme-toggle, [data-theme-toggle]').click();
      await page.waitForTimeout(500); // Wait for theme transition
    }
    
    // Screenshot of dark mode
    await expect(page).toHaveScreenshot('home-page-dark.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('mobile layout matches visual baseline', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone 13 Pro size
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for content to load
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Screenshot of mobile layout
    await expect(page).toHaveScreenshot('home-page-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('mobile sidebar matches visual baseline', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for content to load
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    
    // Open mobile sidebar
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
    
    // Screenshot of mobile sidebar
    const sidebar = page.locator('#mobile-sidebar');
    await expect(sidebar).toHaveScreenshot('mobile-sidebar.png', {
      maxDiffPixels: 50,
    });
  });
});

