import fs from 'fs';
import path from 'path';
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
    await page.setViewportSize({ width: 1280, height: 1081 });
    const projectsFixturePath = path.resolve(process.cwd(), 'api', 'src', 'main', 'resources', 'data', 'projects.json');
    const projectsFixture = JSON.parse(fs.readFileSync(projectsFixturePath, 'utf-8'));
    const limitedProjectsFixture = projectsFixture;

    await page.route(/.*\/api\/projects(?:\?.*)?$/, async (route) => {
      const req = route.request();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(limitedProjectsFixture),
      });
    });

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
    await expect.poll(async () => {
      return await page.locator('#ProjInProgress .project-card, #ProjComplete .project-card').count();
    }, { timeout: 15000 }).toBeGreaterThan(0);
    try {
      await page.waitForFunction(() => {
        const images = Array.from(document.querySelectorAll('.project-card img'));
        if (images.length === 0) return false;
        const viewportHeight = window.innerHeight || 0;
        const viewportWidth = window.innerWidth || 0;
        const inViewImages = images.filter(img => {
          const rect = img.getBoundingClientRect();
          const inViewport = rect.bottom > 0 && rect.right > 0 && rect.top < viewportHeight && rect.left < viewportWidth;
          if (!inViewport) return false;
          const style = window.getComputedStyle(img);
          return style.display !== 'none' && style.visibility !== 'hidden';
        });
        if (inViewImages.length === 0) return false;
        return inViewImages.every(img => img.complete && img.naturalWidth > 0);
      }, { timeout: 15000 });
      const loadedImagesSummary = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('.project-card img'));
        const viewportHeight = window.innerHeight || 0;
        const viewportWidth = window.innerWidth || 0;
        const inViewImages = images.filter(img => {
          const rect = img.getBoundingClientRect();
          const inViewport = rect.bottom > 0 && rect.right > 0 && rect.top < viewportHeight && rect.left < viewportWidth;
          if (!inViewport) return false;
          const style = window.getComputedStyle(img);
          return style.display !== 'none' && style.visibility !== 'hidden';
        });
        return {
          total: images.length,
          inView: inViewImages.length,
          inViewLoaded: inViewImages.filter(img => img.complete && img.naturalWidth > 0).length,
        };
      });
    } catch (error) {
      throw error;
    }
    
    // Screenshot of projects page
    try {
      await expect(page).toHaveScreenshot('projects-page.png', {
        maxDiffPixels: 100,
      });
    } catch (error) {
      throw error;
    }
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
    try {
      await expect(form).toHaveScreenshot('contact-form.png', {
        maxDiffPixels: 50,
      });
    } catch (error) {
      throw error;
    }
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

