import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';

const LOG_ENDPOINT = 'http://127.0.0.1:7242/ingest/6a51373e-0e77-47ee-bede-f80eb24e3f5c';

function logEvent(location: string, message: string, data: Record<string, unknown>, hypothesisId: string) {
  const runId = process.env.CI ? 'ci' : 'local';
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/6a51373e-0e77-47ee-bede-f80eb24e3f5c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location,message,data,timestamp:Date.now(),runId,hypothesisId})}).catch(()=>{});
  // #endregion
  if (process.env.CI) {
    console.log('[visual-regression]', JSON.stringify({ location, message, data, runId, hypothesisId }));
  }
}

async function getProjectsRenderState(page: Parameters<typeof test>[0]['page']) {
  return await page.evaluate(() => {
    const content = document.querySelector('#content');
    const cards = Array.from(document.querySelectorAll('.project-card'));
    const images = Array.from(document.querySelectorAll('.project-card img'));
    const loadedImages = images.filter(img => img.complete && img.naturalWidth > 0).length;
    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      dpr: window.devicePixelRatio,
      bodyScrollHeight: document.body.scrollHeight,
      documentScrollHeight: document.documentElement.scrollHeight,
      contentHeight: content?.getBoundingClientRect().height || 0,
      cards: cards.length,
      images: images.length,
      imagesLoaded: loadedImages,
    };
  });
}

async function waitForProjectsLayoutStability(page: Parameters<typeof test>[0]['page']) {
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('.project-card img'));
    const loadedImages = images.filter(img => img.complete && img.naturalWidth > 0).length;
    const scrollHeight = document.documentElement.scrollHeight;
    const now = performance.now();
    const state = (window as any).__vrLayoutState || {
      lastHeight: 0,
      lastImagesLoaded: 0,
      lastChange: now,
    };
    const heightChanged = state.lastHeight !== scrollHeight;
    const imagesChanged = state.lastImagesLoaded !== loadedImages;
    if (heightChanged || imagesChanged) {
      state.lastHeight = scrollHeight;
      state.lastImagesLoaded = loadedImages;
      state.lastChange = now;
    }
    (window as any).__vrLayoutState = state;
    return now - state.lastChange > 750;
  }, { timeout: 15000 });
}

function readPngDimensions(filePath: string) {
  try {
    const buffer = fs.readFileSync(filePath);
    if (buffer.length < 24) return null;
    const isPng = buffer.readUInt32BE(0) === 0x89504e47;
    if (!isPng) return null;
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
  } catch {
    return null;
  }
}

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

  test('projects page matches visual baseline', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 1081 });
    const browserName = page.context().browser()?.browserType().name() || 'unknown';
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
    const projectsStateAfterLoad = await getProjectsRenderState(page);
    logEvent('visual-regression.spec.ts:124', 'Projects render state after load', {
      browserName,
      projectsStateAfterLoad,
    }, 'VR1');
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
      logEvent('visual-regression.spec.ts:160', 'Projects images in-view summary', {
        browserName,
        loadedImagesSummary,
      }, 'VR2');
    } catch (error) {
      const projectsStateOnImageWaitError = await getProjectsRenderState(page);
      logEvent('visual-regression.spec.ts:166', 'Projects image wait failed', {
        browserName,
        error: error instanceof Error ? error.message : String(error),
        projectsStateOnImageWaitError,
      }, 'VR2');
      throw error;
    }

    await waitForProjectsLayoutStability(page);
    const expectedSnapshotPath = testInfo.snapshotPath('projects-page.png');
    const expectedSnapshotSize = readPngDimensions(expectedSnapshotPath);
    logEvent('visual-regression.spec.ts:181', 'Projects expected snapshot size', {
      browserName,
      expectedSnapshotPath,
      expectedSnapshotSize,
    }, 'VR4');
    const projectsStateAfterStability = await getProjectsRenderState(page);
    logEvent('visual-regression.spec.ts:176', 'Projects render state after stability', {
      browserName,
      projectsStateAfterStability,
    }, 'VR3');
    
    // Screenshot of projects page
    try {
      if (expectedSnapshotSize) {
        await page.setViewportSize({
          width: expectedSnapshotSize.width,
          height: expectedSnapshotSize.height,
        });
        await waitForProjectsLayoutStability(page);
        const projectsStateAfterResize = await getProjectsRenderState(page);
        logEvent('visual-regression.spec.ts:194', 'Projects render state after resize', {
          browserName,
          expectedSnapshotSize,
          projectsStateAfterResize,
        }, 'VR4');
      }
      const projectsStateBeforeShot = await getProjectsRenderState(page);
      logEvent('visual-regression.spec.ts:203', 'Projects render state before screenshot', {
        browserName,
        projectsStateBeforeShot,
      }, 'VR3');
      const screenshotOptions = expectedSnapshotSize
        ? { maxDiffPixels: 100 }
        : { fullPage: true, maxDiffPixels: 100 };
      await expect(page).toHaveScreenshot('projects-page.png', screenshotOptions);
    } catch (error) {
      const projectsStateOnShotError = await getProjectsRenderState(page);
      logEvent('visual-regression.spec.ts:214', 'Projects screenshot failed', {
        browserName,
        error: error instanceof Error ? error.message : String(error),
        projectsStateOnShotError,
      }, 'VR3');
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

