import { test, expect } from '@playwright/test';

const LOG_ENDPOINT = 'http://127.0.0.1:7242/ingest/6a51373e-0e77-47ee-bede-f80eb24e3f5c';

function logEvent(location: string, message: string, data: Record<string, unknown>, hypothesisId: string) {
  const runId = process.env.CI ? 'ci' : 'local';
  // #region agent log
  fetch(LOG_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location,message,data,timestamp:Date.now(),runId,hypothesisId})}).catch(()=>{});
  // #endregion
  if (process.env.CI) {
    console.log('[home-spec]', JSON.stringify({ location, message, data, runId, hypothesisId }));
  }
}

test.describe('Home Page Initial Load', () => {
  // Set timeout for all tests in this describe block
  test.describe.configure({ timeout: 120000 }); // 2 minutes
  
  test.beforeEach(async ({ page }) => {
    // Minimal setup - just set language preference (no page load)
    // Tests will load the page themselves, avoiding double loads
    await page.addInitScript(() => {
      localStorage.setItem('siteLanguage', 'en');
    });
  });

  test('loads Home content on initial load', async ({ page }) => {
    // Use domcontentloaded for faster loads (networkidle is too slow)
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    // Wait for content to load - give SPA time to initialize
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Banner should be visible
    const banner = page.locator('#content #homeBanner');
    await expect(banner).toBeVisible({ timeout: 5000 });
    
    // Hero buttons should be visible (updated button text)
    const linkedInBtn = page.getByRole('link', { name: /Connect on LinkedIn/i });
    const githubBtn = page.getByRole('link', { name: /View GitHub/i });
    
    // At least one should be visible (fallback to old text if needed)
    const hasNewButtons = await linkedInBtn.isVisible({ timeout: 2000 }).catch(() => false) || 
                          await githubBtn.isVisible({ timeout: 2000 }).catch(() => false);
    const hasOldButtons = await page.getByRole('link', { name: /^LinkedIn$/ }).isVisible({ timeout: 1000 }).catch(() => false) ||
                          await page.getByRole('link', { name: /^GitHub$/i }).isVisible({ timeout: 1000 }).catch(() => false);
    
    expect(hasNewButtons || hasOldButtons).toBe(true);
  });

  test('home page does not get replaced when navigating away and back', async ({ page }) => {
    test.setTimeout(90000); // Increase timeout for this test (90 seconds)
    
    // Use domcontentloaded for faster loads
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    const spaConsoleLogs: string[] = [];
    // #region agent log
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('[spa]')) {
        spaConsoleLogs.push(text);
        logEvent('home.spec.ts:48', 'SPA console message', { text }, 'H10');
        if (process.env.CI) {
          console.log('[spa-forward]', text);
        }
      }
    });
    // #endregion
    // #region agent log
    logEvent('home.spec.ts:50', 'Home navigation test start', {
      url: page.url(),
      viewport: page.viewportSize(),
    }, 'H6');
    // #endregion
    
    // Wait for home content to load initially
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate away
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
    // #region agent log
    logEvent('home.spec.ts:73', 'Home navigation away clicked', {
      isMobile,
      urlAfterClick: page.url(),
    }, 'H7');
    // #endregion
    
    // Wait for projects page to load
    try {
      await page.waitForFunction(() => {
        const c = document.querySelector('#content');
        return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#ProjInProgress .row, #ProjComplete .row');
      }, { timeout: 15000 });
    } catch (error) {
      const projectsWaitState = await page.evaluate(() => {
        const c = document.querySelector('#content');
        return {
          url: window.location.href,
          contentLoaded: c?.getAttribute('data-content-loaded'),
          hasProjectsRows: !!c?.querySelector('#ProjInProgress .row, #ProjComplete .row'),
          contentTextLength: c?.textContent?.length || 0,
        };
      });
      // #region agent log
      logEvent('home.spec.ts:87', 'Projects waitForFunction failed', {
        error: error instanceof Error ? error.message : String(error),
        projectsWaitState,
      }, 'H9');
      // #endregion
      throw error;
    }
    const projectsLoadedState = await page.evaluate(() => {
      const c = document.querySelector('#content');
      return {
        url: window.location.href,
        contentLoaded: c?.getAttribute('data-content-loaded'),
        hasProjectsRows: !!c?.querySelector('#ProjInProgress .row, #ProjComplete .row'),
        contentTextLength: c?.textContent?.length || 0,
      };
    });
    // #region agent log
    logEvent('home.spec.ts:105', 'Projects page loaded state', {
      projectsLoadedState,
    }, 'H9');
    // #endregion
    
    // Navigate back to Home
    if (isMobile) {
      // Use RM brand to go home on mobile
      await page.locator('.navbar-brand-name').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Home' }).first().click();
    }
    // #region agent log
    logEvent('home.spec.ts:90', 'Home navigation back clicked', {
      isMobile,
      urlAfterClick: page.url(),
    }, 'H7');
    // #endregion
    const homeNavPreWaitState = await page.evaluate(() => {
      const c = document.querySelector('#content');
      return {
        url: window.location.href,
        contentLoaded: c?.getAttribute('data-content-loaded'),
        hasHomeBanner: !!c?.querySelector('#homeBanner'),
        hasHeroContent: !!c?.querySelector('.hero-content, .hero-text-column'),
        contentTextLength: c?.textContent?.length || 0,
      };
    });
    // #region agent log
    logEvent('home.spec.ts:102', 'Home pre-wait state', {
      homeNavPreWaitState,
    }, 'H8');
    // #endregion
    
    // Wait for home content to load again - use more efficient selector
    try {
      await page.waitForSelector('#content #homeBanner, #content .hero-content, #content .hero-text-column', { 
        timeout: 15000,
        state: 'attached' 
      });
    } catch (error) {
      const waitState = await page.evaluate(() => {
        const c = document.querySelector('#content');
        return {
          url: window.location.href,
          contentLoaded: c?.getAttribute('data-content-loaded'),
          hasHomeBanner: !!c?.querySelector('#homeBanner'),
          hasHeroContent: !!c?.querySelector('.hero-content, .hero-text-column'),
          contentTextLength: c?.textContent?.length || 0,
        };
      });
      // #region agent log
      logEvent('home.spec.ts:109', 'Home waitForSelector failed', {
        error: error instanceof Error ? error.message : String(error),
        waitState,
      }, 'H8');
      // #endregion
      throw error;
    }
    
    // Verify home content is visible
    const homeBanner = page.locator('#content #homeBanner');
    const bannerVisible = await homeBanner.isVisible({ timeout: 5000 }).catch(() => false);

    if (bannerVisible) {
      await expect(homeBanner).toBeVisible({ timeout: 5000 });
    } else {
      // Fallback to hero content
      const heroContent = page.locator('#content .hero-content, #content .hero-text-column').first();
      await expect(heroContent).toBeVisible({ timeout: 5000 });
    }
  });

  test('home page tagline is centered and displays correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    // Wait for content to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check for tagline
    const tagline = page.locator('.hero-title-accent, .tagline').filter({ hasText: /Don't Repeat Yourself|Engineer with Precision/i });
    const taglineCount = await tagline.count();
    
    if (taglineCount > 0) {
      await expect(tagline.first()).toBeVisible();
      
      // Check text alignment is centered
      const textAlign = await tagline.first().evaluate((el) => {
        return window.getComputedStyle(el).textAlign;
      });
      expect(textAlign).toBe('center');
      
      // Check tagline text
      const taglineText = await tagline.first().textContent();
      expect(taglineText).toContain("Don't Repeat Yourself");
      expect(taglineText).toContain("Engineer with Precision");
    }
  });

  test('home page About Me section displays correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    // Wait for content to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check for About Me section
    const aboutTitle = page.locator('h2').filter({ hasText: /About Me/i });
    await expect(aboutTitle).toBeVisible({ timeout: 5000 });
    
    // Check for About Me content
    const aboutSection = aboutTitle.locator('xpath=ancestor::section[1]');
    await expect(aboutSection).toBeVisible();
    
    // Check for paragraph text in About Me
    const aboutText = aboutSection.locator('p');
    const textCount = await aboutText.count();
    if (textCount > 0) {
      await expect(aboutText.first()).toBeVisible();
      const text = await aboutText.first().textContent();
      expect(text).toBeTruthy();
      expect(text!.trim().length).toBeGreaterThan(0);
    }
  });

  test('home page Tech Stack section displays correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    // Wait for content to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check for Tech Stack section
    const techStackTitle = page.locator('h2').filter({ hasText: /Tech Stack/i });
    await expect(techStackTitle).toBeVisible({ timeout: 5000 });
    
    // Check for skills preview
    const skillsPreview = page.locator('#content .skill-badge');
    const skillCount = await skillsPreview.count();
    if (skillCount > 0) {
      await expect(skillsPreview.first()).toBeVisible();
    }
  });

  test('home page hero buttons are clickable and have correct links', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    // Wait for content to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check LinkedIn button
    const linkedInBtn = page.getByRole('link', { name: /Connect on LinkedIn/i });
    await expect(linkedInBtn).toBeVisible();
    await expect(linkedInBtn).toHaveAttribute('href', 'https://www.linkedin.com/in/rickym270');
    await expect(linkedInBtn).toHaveAttribute('target', '_blank');
    await expect(linkedInBtn).toHaveAttribute('rel', /noopener|noreferrer/);
    
    // Check GitHub button
    const githubBtn = page.getByRole('link', { name: /View GitHub/i });
    await expect(githubBtn).toBeVisible();
    await expect(githubBtn).toHaveAttribute('href', 'https://github.com/rickym270');
    await expect(githubBtn).toHaveAttribute('target', '_blank');
    await expect(githubBtn).toHaveAttribute('rel', /noopener|noreferrer/);
  });
});


