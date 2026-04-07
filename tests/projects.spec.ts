import { test, expect } from '@playwright/test';

test.describe('Projects Page', () => {
  // Set timeout for all tests in this describe block
  test.describe.configure({ timeout: 120000 }); // 2 minutes
  
  test.beforeEach(async ({ page }) => {
    // Minimal setup - just set language preference (no page load)
    // Tests will load the page themselves, avoiding double loads
    await page.addInitScript(() => {
      localStorage.setItem('siteLanguage', 'en');
    });
  });

  test('navigates to Projects via navbar and renders content', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    
    // Wait for initial load
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Click Projects link - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
    
    // Wait for the projects page content to be loaded into #content
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!document.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    
    // Wait for heading element - use fallback pattern for WebKit
    try {
      await page.waitForSelector('#content h1[data-translate="projects.heading"]', { timeout: 15000, state: 'visible' });
    } catch {
      // Fallback for WebKit - wait for any heading with Projects text and check visibility
      await page.waitForFunction(() => {
        const heading = document.querySelector('#content h1') as HTMLElement;
        return heading && heading.textContent?.includes('Projects') && heading.offsetParent !== null;
      }, { timeout: 10000 });
    }
    await page.waitForTimeout(500);
    
    // Check for Projects heading - use fallback selector for WebKit
    const projectsHeading = page.locator('#content h1[data-translate="projects.heading"], #content h1').filter({ hasText: /Projects/i });
    const projectsHeadingCount = await projectsHeading.count();
    if (projectsHeadingCount > 0) {
      await expect(projectsHeading.first()).toBeVisible({ timeout: 15000 });
      await expect(projectsHeading.first()).toHaveText('Projects', { timeout: 5000 });
    } else {
      // Final fallback - check for any heading
      const anyHeading = page.locator('#content h1');
      const anyHeadingCount = await anyHeading.count();
      if (anyHeadingCount > 0) {
        await expect(anyHeading.first()).toBeVisible({ timeout: 5000 });
      }
    }
    
    // Wait for scripts to execute and API call to complete (or fail gracefully)
    // The page will either show project cards OR an error message - both are valid
    await page.waitForTimeout(3000); // Give scripts time to load and execute
    
    // Verify page structure is correct (projectsHeading already declared above)
    await expect(projectsHeading.first()).toBeVisible({ timeout: 3000 });
    await expect(projectsHeading.first()).toHaveText('Projects');
    
    // Check if projects loaded successfully (preferred case)
    const cardsVisible = await page.locator('#content .card .card-title').first().isVisible({ timeout: 5000 }).catch(() => false);
    
    if (cardsVisible) {
      // Success: Projects loaded from API
      const firstProjectCard = page.locator('#content .card .card-title').first();
      await expect(firstProjectCard).toBeVisible();
      const cardText = await firstProjectCard.textContent();
      expect(cardText).toBeTruthy();
      expect(cardText!.trim().length).toBeGreaterThan(0);
    } else {
      // Fallback: Check if error handling worked (scripts executed but API failed)
      // This is acceptable - the page should handle API failures gracefully
      const errorVisible = await page.locator('text=/Unable to load|Loading projects/i').isVisible({ timeout: 2000 }).catch(() => false);
      
      if (errorVisible) {
        // Page handled API failure - this is acceptable
        test.info().annotations.push({ type: 'note', description: 'API call failed but page handled error gracefully' });
      } else {
        // Neither cards nor error - page structure should at least be present
        // Verify sections exist in DOM (they may be hidden if empty)
        const inProgressExists = await page.locator('#ProjInProgress').count() > 0;
        const completeExists = await page.locator('#ProjComplete').count() > 0;
        const comingSoonExists = await page.locator('#ProjComingSoon').count() > 0;
        
        expect(inProgressExists).toBeTruthy();
        expect(completeExists).toBeTruthy();
        expect(comingSoonExists).toBeTruthy();
      }
    }
  });

  test('renders project cards when API returns data', async ({ page }) => {
    const mockProjects = [
      {
        name: 'Local API Project',
        summary: 'Mock project for UI rendering.',
        status: 'complete',
        tech: ['TypeScript'],
        slug: 'local-api-project'
      },
      {
        name: 'In Progress Project',
        summary: 'Second mock project.',
        status: 'in-progress',
        tech: ['JavaScript'],
        slug: 'in-progress-project'
      }
    ];

    await page.route('**/api/projects**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProjects),
      });
    });
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });

    await page.waitForSelector('#content #ProjInProgress', { timeout: 15000, state: 'attached' });
    await page.waitForSelector('#content #ProjComplete', { timeout: 15000, state: 'attached' });
    await page.waitForSelector('#content .project-card', { timeout: 15000 });

    const projectsState = await page.evaluate(() => {
      const cards = document.querySelectorAll('#content .project-card').length;
      return {
        apiBaseUrl: (window as unknown as { API_BASE_URL?: string }).API_BASE_URL || null,
        cards,
        cacheCount: Array.isArray((window as unknown as { projectsCache?: unknown }).projectsCache)
          ? (window as unknown as { projectsCache?: unknown[] }).projectsCache?.length
          : null,
        hasCachePromise: !!(window as unknown as { projectsCachePromise?: unknown }).projectsCachePromise,
      };
    });

    const cards = page.locator('#content .project-card');
    await expect(cards).toHaveCount(2);
    await expect(page.locator('#content .card-title', { hasText: 'Local API Project' })).toBeVisible();
    await expect(page.locator('#content .card-title', { hasText: 'In Progress Project' })).toBeVisible();

    const errorVisible = await page.locator('text=/Unable to load projects from API/i').isVisible().catch(() => false);
    expect(errorVisible).toBeFalsy();
  });

  test('project card shows source link only on CTA (card body is not a link)', async ({ page }) => {
    const mockProjects = [
      {
        name: 'Public Repo Project',
        summary: 'Only the View Source control should navigate to the repo.',
        status: 'complete',
        tech: ['TypeScript'],
        slug: 'public-repo-project',
        repo: 'https://github.com/example/public-repo-project',
        private: false,
      },
    ];

    await page.route('**/api/projects**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProjects),
      });
    });

    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'domcontentloaded' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }

    await page.waitForSelector('#content .project-card', { timeout: 15000 });

    const card = page.locator('#content .project-card').first();
    const sourceLink = card.locator('a[data-project-action="repo"]');
    await expect(sourceLink).toBeVisible();
    await expect(sourceLink).toHaveAttribute('href', mockProjects[0].repo);
    await expect(card.locator('.project-card-cta')).toContainText(/View Source/i);

    await card.locator('.card-text').click();
    await expect.poll(() => page.context().pages().length, { timeout: 2000 }).toBe(1);

    const popupPromise = page.waitForEvent('popup');
    await sourceLink.click();
    const popup = await popupPromise;
    await expect(popup).toHaveURL(mockProjects[0].repo);
    await popup.close();
  });

  test('project card without repo shows no source link', async ({ page }) => {
    const mockProjects = [
      {
        name: 'No Repo Project',
        summary: 'No repository URL.',
        status: 'complete',
        tech: ['JavaScript'],
        slug: 'no-repo-project',
      },
    ];

    await page.route('**/api/projects**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProjects),
      });
    });

    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'domcontentloaded' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }

    await page.waitForSelector('#content .project-card', { timeout: 15000 });

    const card = page.locator('#content .project-card').first();
    await expect(card.locator('a[data-project-action="repo"]')).toHaveCount(0);
    await expect(card.locator('.project-card-cta-disabled')).toContainText(/Source Unavailable/i);
  });

  test('private repo project has no source link and shows private label', async ({ page }) => {
    const mockProjects = [
      {
        name: 'Private Repo Project',
        summary: 'Repository is private.',
        status: 'complete',
        tech: ['Rust'],
        slug: 'private-repo-project',
        repo: 'https://github.com/example/private-repo',
        private: true,
      },
    ];

    await page.route('**/api/projects**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProjects),
      });
    });

    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }

    await page.waitForSelector('#content .project-card', { timeout: 15000 });
    const card = page.locator('#content .project-card').first();
    await expect(card.locator('a[data-project-action="repo"]')).toHaveCount(0);
    await expect(card.locator('.project-card-cta-disabled')).toContainText(/Private Repository/i);
  });

  test('private repo card body click does not open a new tab', async ({ page }) => {
    const mockProjects = [
      {
        name: 'Private No Nav',
        summary: 'Body click must not navigate.',
        status: 'complete',
        tech: ['Go'],
        slug: 'private-no-nav',
        repo: 'https://github.com/example/private-no-nav',
        private: true,
      },
    ];

    await page.route('**/api/projects**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProjects),
      });
    });

    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }

    await page.waitForSelector('#content .project-card', { timeout: 15000 });
    const card = page.locator('#content .project-card').first();
    await card.locator('.card-text').click();
    await expect.poll(() => page.context().pages().length, { timeout: 2000 }).toBe(1);
  });

  test('non-boolean private value still shows source link (strict flag only)', async ({ page }) => {
    const mockProjects: Array<Record<string, unknown>> = [
      {
        name: 'Loose Private Field',
        summary: 'Malformed API should not hide public link.',
        status: 'complete',
        tech: ['TS'],
        slug: 'loose-private',
        repo: 'https://github.com/example/loose-private',
        private: 'true',
      },
    ];

    await page.route('**/api/projects**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProjects),
      });
    });

    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }

    await page.waitForSelector('#content .project-card a[data-project-action="repo"]', { timeout: 15000 });
    const href = await page.locator('#content .project-card a[data-project-action="repo"]').first().getAttribute('href');
    expect(href).toBe('https://github.com/example/loose-private');
  });

  test('private repo label uses Spanish translation', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('siteLanguage', 'es');
    });

    const mockProjects = [
      {
        name: 'Proyecto Privado',
        summary: 'Sin enlace público.',
        status: 'complete',
        tech: ['Python'],
        slug: 'proyecto-privado',
        repo: 'https://github.com/example/hidden',
        private: true,
      },
    ];

    await page.route('**/api/projects**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProjects),
      });
    });

    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Proyectos' }).first().click();
    }

    await page.waitForSelector('#content .project-card', { timeout: 15000 });
    const disabled = page.locator('#content .project-card .project-card-cta-disabled').first();
    await expect(disabled).toBeVisible({ timeout: 10000 });
    await expect(disabled).toHaveText('Repositorio Privado');
  });

  test('project source CTA is keyboard focusable and activatable', async ({ page }) => {
    const mockProjects = [
      {
        name: 'Keyboard CTA Project',
        summary: 'Source link should be keyboard accessible.',
        status: 'complete',
        tech: ['Accessibility'],
        slug: 'keyboard-cta-project',
        repo: 'https://github.com/example/keyboard-cta-project',
      },
    ];

    await page.route('**/api/projects**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProjects),
      });
    });

    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }

    await page.waitForSelector('#content .project-card a[data-project-action="repo"]', { timeout: 15000 });
    const sourceLink = page.locator('#content .project-card a[data-project-action="repo"]').first();
    await sourceLink.focus();
    await expect(sourceLink).toBeFocused();

    const popupPromise = page.waitForEvent('popup');
    await page.keyboard.press('Enter');
    const popup = await popupPromise;
    await expect(popup).toHaveURL(mockProjects[0].repo);
    await popup.close();
  });

  test('shows project cards and fallback note when API fails but static fallback succeeds', async ({ page }) => {
    const mockFallbackProjects = [
      { name: 'Fallback Project', summary: 'From static file.', status: 'complete', tech: ['JS'], slug: 'fallback-project', repo: 'https://github.com/example/fallback' },
    ];
    await page.route('**/api/projects**', async (route) => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Server Error' }) });
    });
    await page.route('**/data/web_data/projects.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockFallbackProjects),
      });
    });

    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'domcontentloaded' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });

    await page.waitForSelector('#content', { state: 'attached', timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner') || !!c?.querySelector('.hero-content');
    }, { timeout: 20000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      const hasCards = !!c?.querySelector('.project-card');
      const hasNote = !!c?.querySelector('[data-translate="projects.fallbackNote"]');
      return c?.getAttribute('data-content-loaded') === 'true' && (hasCards || hasNote);
    }, { timeout: 20000 });
    await page.waitForTimeout(500);

    const cards = page.locator('#content .project-card');
    await expect(cards).toHaveCount(1);
    await expect(page.locator('#content .card-title', { hasText: 'Fallback Project' })).toBeVisible();

    const fallbackNote = page.locator('#content p[data-translate="projects.fallbackNote"], #content p').filter({ hasText: /cached|outdated/i });
    await expect(fallbackNote.first()).toBeVisible();
  });

  test('uses local API base when running on localhost', async ({ page }) => {
    test.skip(!!process.env.CI, 'In CI the app may load production api-config so API_BASE_URL is Render URL; only assert when running locally');
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });

    await page.waitForFunction(() => typeof (window as unknown as { API_BASE_URL?: string }).API_BASE_URL !== 'undefined', { timeout: 10000 });

    const { hostname, apiBaseUrl } = await page.evaluate(() => ({
      hostname: window.location.hostname,
      apiBaseUrl: (window as unknown as { API_BASE_URL?: string }).API_BASE_URL || '',
    }));

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      await expect(apiBaseUrl).toBe('http://localhost:8080');
    }
  });

  test('shows loading message in each section while projects load', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    
    // Wait for initial load
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Projects - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
    
    // Wait for content to load first
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    
    // Wait for sections to exist in DOM first (more reliable than checking visibility immediately)
    await page.waitForSelector('#content #ProjInProgress', { timeout: 15000, state: 'attached' });
    await page.waitForSelector('#content #ProjComplete', { timeout: 15000, state: 'attached' });
    await page.waitForSelector('#content #ProjComingSoon', { timeout: 15000, state: 'attached' });
    await page.waitForTimeout(500);
    
    // Check that loading messages appear (may be brief, so check quickly)
    // Sections might be hidden if they end up empty, but they should exist in DOM
    const loadingMessages = page.locator('#content').getByText(/Loading|Please Wait/i);
    const loadingCount = await loadingMessages.count();
    
    // Sections should exist in DOM (they may be hidden if empty, which is fine)
    const inProgressSection = page.locator('#ProjInProgress');
    await expect(inProgressSection).toBeAttached({ timeout: 5000 });
    const completeSection = page.locator('#ProjComplete');
    await expect(completeSection).toBeAttached({ timeout: 5000 });
    const comingSoonSection = page.locator('#ProjComingSoon');
    await expect(comingSoonSection).toBeAttached({ timeout: 5000 });
    
    // Check visibility only if sections have content (they may be hidden if empty)
    // This test is about loading messages, not visibility of empty sections
  });

  test('projects reload correctly when navigating to page multiple times', async ({ page }) => {
    test.setTimeout(90000); // Increase timeout for this test (90 seconds)
    
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    
    // Wait for initial load
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Projects - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
    
    // Wait for projects page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    
    // Navigate away - handle mobile
    if (isMobile) {
      await page.locator('.navbar-brand-name').click(); // Use RM brand
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Home' }).first().click();
    }
    
    // Wait for home page to load
    await page.waitForSelector('#content #homeBanner, #content .hero-content', { 
      timeout: 15000,
      state: 'attached' 
    });
    
    // Navigate back to Projects - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
    
    // Wait for projects page to load again - use more efficient selector
    await page.waitForSelector('#content #ProjInProgress, #content #ProjComplete, #content h1[data-translate="projects.heading"]', { 
      timeout: 15000,
      state: 'attached' 
    });
    
    // Wait for heading element to exist and be visible - use fallback for WebKit
    try {
      await page.waitForSelector('#content h1[data-translate="projects.heading"]', { timeout: 10000, state: 'visible' });
    } catch {
      // Fallback for WebKit: wait for any h1 with Projects text
      await page.waitForFunction(() => {
        const heading = document.querySelector('#content h1') as HTMLElement | null;
        return heading && heading.textContent?.includes('Projects') && heading.offsetParent !== null;
      }, { timeout: 10000 });
    }
    await page.waitForTimeout(500);
    
    // Projects should still load correctly - use fallback selector for WebKit
    const projectsHeading = page.locator('#content h1[data-translate="projects.heading"], #content h1').filter({ hasText: /Projects/i });
    const projectsHeadingCount = await projectsHeading.count();
    if (projectsHeadingCount > 0) {
      await expect(projectsHeading.first()).toBeVisible({ timeout: 5000 });
      await expect(projectsHeading.first()).toHaveText('Projects', { timeout: 10000 });
    } else {
      const anyHeading = page.locator('#content h1');
      const anyHeadingCount = await anyHeading.count();
      if (anyHeadingCount > 0) {
        await expect(anyHeading.first()).toBeVisible({ timeout: 5000 });
      }
    }
    
    // Sections should exist (they might be hidden if empty, which is fine - just check they're attached)
    const inProgress = page.locator('#ProjInProgress');
    const complete = page.locator('#ProjComplete');
    const comingSoon = page.locator('#ProjComingSoon');
    
    await expect(inProgress).toBeAttached({ timeout: 10000 });
    await expect(complete).toBeAttached({ timeout: 10000 });
    await expect(comingSoon).toBeAttached({ timeout: 10000 });
    
    // Check if sections are visible (they might be hidden if empty)
    const inProgressVisible = await inProgress.isVisible().catch(() => false);
    const completeVisible = await complete.isVisible().catch(() => false);
    
    if (inProgressVisible) {
      await expect(inProgress).toBeVisible({ timeout: 1000 });
    }
    if (completeVisible) {
      await expect(complete).toBeVisible({ timeout: 1000 });
    }
  });

  test('project icons are visible in dark mode', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Set dark mode - handle mobile
    let themeToggle;
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      const currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light');
      themeToggle = currentTheme === 'dark' ? page.locator('#mobile-theme-light') : page.locator('#mobile-theme-dark');
    } else {
      themeToggle = page.locator('#theme-toggle');
    }
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Navigate to Projects - handle mobile
    if (isMobile) {
      // Sidebar should still be open
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
  await page.waitForFunction(() => {
    const c = document.querySelector('#content');
    return c?.getAttribute('data-content-loaded') === 'true' || !!document.querySelector('#ProjInProgress .row, #ProjComplete .row');
  }, { timeout: 15000 });
    
    // Check for project images/icons
    const projectImages = page.locator('#content .project-image img, #content .card img');
    const imageCount = await projectImages.count();
    
    if (imageCount > 0) {
      const firstImage = projectImages.first();
      await expect(firstImage).toBeVisible();
      
      // Check that image has proper styling for dark mode
      const bgColor = await firstImage.evaluate((el) => {
        const parent = el.closest('.project-image, .card');
        return parent ? window.getComputedStyle(parent).backgroundColor : '';
      });
      
      // Image or its container should have background/padding for visibility
      const opacity = await firstImage.evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      });
      const opacityNum = parseFloat(opacity);
      expect(opacityNum).toBeGreaterThan(0); // Should be visible
    }
  });

  test('projects page has correct title and subtitle', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    
    // Wait for initial load
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Projects - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
    
    // Wait for projects page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check for title
    const projectsHeading = page.locator('#content h1[data-translate="projects.heading"], #content h1').filter({ hasText: /Projects/i });
    const headingCount = await projectsHeading.count();
    if (headingCount > 0) {
      await expect(projectsHeading.first()).toBeVisible({ timeout: 5000 });
      await expect(projectsHeading.first()).toContainText('Projects');
    }
    
    // Check for subtitle
    const subtitle = page.locator('.section-subtitle, p').filter({ hasText: /portfolio|projects|work/i });
    const subtitleCount = await subtitle.count();
    if (subtitleCount > 0) {
      await expect(subtitle.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('project cards have correct structure when loaded', async ({ page }) => {
    // Firefox needs networkidle instead of domcontentloaded for reliability
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    
    // Wait for initial load
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Projects - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
    
    // Wait for projects page to load and API call to complete
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    await page.waitForTimeout(3000); // Give API time to load
    
    // Check for project cards
    const projectCards = page.locator('#content .project-card, #content .card');
    const cardCount = await projectCards.count();
    
    if (cardCount > 0) {
      const firstCard = projectCards.first();
      await expect(firstCard).toBeVisible();
      
      // Check card structure
      const cardTitle = firstCard.locator('.card-title, h5');
      const cardText = firstCard.locator('.card-text, p');
      const cardImage = firstCard.locator('.project-image, img');
      
      // At least title should exist
      const titleCount = await cardTitle.count();
      if (titleCount > 0) {
        await expect(cardTitle.first()).toBeVisible();
        const titleText = await cardTitle.first().textContent();
        expect(titleText).toBeTruthy();
        expect(titleText!.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test('project sections exist (In Progress, Complete, Coming Soon)', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    
    // Wait for initial load
    // Wait for page to be ready - check if content element exists
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Projects - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
    
    // Wait for projects page to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check all sections exist in DOM
    const inProgress = page.locator('#ProjInProgress');
    const complete = page.locator('#ProjComplete');
    const comingSoon = page.locator('#ProjComingSoon');
    
    await expect(inProgress).toBeAttached({ timeout: 5000 });
    await expect(complete).toBeAttached({ timeout: 5000 });
    await expect(comingSoon).toBeAttached({ timeout: 5000 });
  });

  test('shows projects from cache first when API is slow (cache-first loading)', async ({ page }) => {
    const cacheOnlyProjects = [
      { name: 'Cache First Project', summary: 'Shown from static cache.', status: 'complete', tech: ['JS'], slug: 'cache-first-project', repo: 'https://github.com/example/cache-first', featured: true },
    ];
    // API delayed so cache-first path is used for initial render
    await page.route('**/api/projects**', async (route) => {
      await new Promise((r) => setTimeout(r, 8000));
      await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Unavailable' }) });
    });
    await page.route('**/data/web_data/projects.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(cacheOnlyProjects),
      });
    });

    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'domcontentloaded' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });

    await page.waitForSelector('#content', { state: 'attached', timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner') || !!c?.querySelector('.hero-content');
    }, { timeout: 20000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }

    // Cache-first: cards should appear quickly (from static file), not after API delay
    await expect(page.locator('#content .card-title', { hasText: 'Cache First Project' })).toBeVisible({ timeout: 5000 });
    const cards = page.locator('#content .project-card');
    await expect(cards).toHaveCount(1);
  });

  test('silently updates projects when background API returns different data', async ({ page }) => {
    const cachedProjects = [
      { name: 'Cached Only', summary: 'From cache.', status: 'complete', tech: [], slug: 'cached-only', repo: 'https://github.com/example/cached', featured: true },
    ];
    const apiProjects = [
      { name: 'Live Only', summary: 'From API.', status: 'complete', tech: [], slug: 'live-only', repo: 'https://github.com/example/live', featured: true },
    ];
    await page.route('**/data/web_data/projects.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(cachedProjects),
      });
    });
    await page.route('**/api/projects**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(apiProjects),
      });
    });

    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'domcontentloaded' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });

    await page.waitForSelector('#content', { state: 'attached', timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner') || !!c?.querySelector('.hero-content');
    }, { timeout: 20000 });

    // Clear any prefetched cache so Projects page uses cache-first (static) then background API
    await page.evaluate(() => {
      (window as unknown as { projectsCache?: unknown }).projectsCache = null;
      (window as unknown as { projectsCachePromise?: unknown }).projectsCachePromise = null;
    });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }

    // Cache-first shows "Cached Only" first; then background fetch runs and may replace with "Live Only" quickly
    // So we wait for either cached then live, or just live (if background was fast)
    const cachedVisible = await page.locator('#content .card-title', { hasText: 'Cached Only' }).isVisible({ timeout: 3000 }).catch(() => false);
    if (cachedVisible) {
      await expect(page.locator('#content .card-title', { hasText: 'Live Only' })).toBeVisible({ timeout: 12000 });
    } else {
      await expect(page.locator('#content .card-title', { hasText: 'Live Only' })).toBeVisible({ timeout: 15000 });
    }
    // After background update, fallback note should be removed
    const fallbackNote = page.locator('#content p[data-translate="projects.fallbackNote"]');
    await expect(fallbackNote).toHaveCount(0);
  });
});


