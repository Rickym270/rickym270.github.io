import { test, expect } from '@playwright/test';

test.describe('End-to-End User Journeys', () => {
  test.describe.configure({ timeout: 180000 }); // 3 minutes for full journeys

  test('complete user journey: browse portfolio', async ({ page }) => {
    // Start at home page
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for content to load
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Verify home page loaded
    const homeContent = page.locator('#content');
    await expect(homeContent).toBeVisible();
    
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Projects
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
    
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#ProjInProgress, #ProjComplete');
    }, { timeout: 15000 });
    
    // Verify projects page loaded
    const projectsContent = page.locator('#content');
    await expect(projectsContent).toBeVisible();
    
    // Navigate to Skills
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/skills.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Skills' }).first().click();
    }
    
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('h1, h3');
    }, { timeout: 15000 });
    
    // Verify skills page loaded
    const skillsContent = page.locator('#content');
    await expect(skillsContent).toBeVisible();
    
    // Navigate back to Home
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/home.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Home' }).first().click();
    }
    
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Verify back at home
    const finalContent = page.locator('#content');
    await expect(finalContent).toBeVisible();
  });

  test('complete user journey: contact form submission', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for initial content
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Contact
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first().click();
    }
    
    // Wait for contact form
    await page.waitForSelector('#contact-form, form', { timeout: 15000 });
    
    // Fill out form
    await page.locator('input[name="name"], #name').fill('Test User');
    await page.locator('input[name="email"], #email').fill('test@example.com');
    await page.locator('input[name="subject"], #subject').fill('Test Subject');
    await page.locator('textarea[name="message"], #message').fill('This is a test message from an E2E user journey test.');
    
    // Intercept API call
    let requestIntercepted = false;
    await page.route(/.*\/api\/contact/, async (route) => {
      requestIntercepted = true;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-id',
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'This is a test message from an E2E user journey test.',
          receivedAt: new Date().toISOString()
        })
      });
    });
    
    // Submit form
    await page.locator('button[type="submit"], #submit-btn').click();
    
    // Wait for success message
    await page.waitForSelector('#form-message.alert-success, .alert-success', { timeout: 15000 });
    
    // Verify success
    const successMessage = page.locator('#form-message.alert-success, .alert-success');
    await expect(successMessage).toBeVisible();
    
    // Verify API was called
    expect(requestIntercepted).toBe(true);
  });

  test('complete user journey: language switching', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for initial content
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Verify English content (default)
    const homeLink = page.locator('a:has-text("Home"), .nav-link:has-text("Home")').first();
    await expect(homeLink).toBeVisible();
    
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Switch to Spanish
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('#mobile-language-switcher button[data-lang="es"], #mobile-language-toggle button[data-lang="es"]').click();
    } else {
      await page.locator('#language-switcher button[data-lang="es"], #language-switcher-medium button[data-lang="es"]').click();
    }
    
    // Wait for translation
    await page.waitForTimeout(1000);
    
    // Verify Spanish content (should see "Inicio" or Spanish text)
    const spanishContent = page.locator('a:has-text("Inicio"), .nav-link:has-text("Inicio"), [data-translate="nav.home"]').first();
    // Either Spanish text appears or translation attribute is present
    const hasSpanish = await spanishContent.count() > 0 || 
                      await page.evaluate(() => {
                        const lang = localStorage.getItem('siteLanguage');
                        return lang === 'es';
                      });
    expect(hasSpanish).toBeTruthy();
    
    // Switch back to English
    if (isMobile) {
      await page.locator('#mobile-language-switcher button[data-lang="en"], #mobile-language-toggle button[data-lang="en"]').click();
    } else {
      await page.locator('#language-switcher button[data-lang="en"], #language-switcher-medium button[data-lang="en"]').click();
    }
    
    await page.waitForTimeout(1000);
    
    // Verify English content again
    const englishContent = page.locator('a:has-text("Home"), .nav-link:has-text("Home")').first();
    await expect(englishContent).toBeVisible();
  });

  test('complete user journey: theme switching and navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for initial content
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Toggle to dark mode
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('#mobile-theme-toggle, [data-theme-toggle]').click();
    } else {
      await page.locator('#theme-toggle, [data-theme-toggle]').click();
    }
    
    await page.waitForTimeout(500);
    
    // Verify dark theme applied
    const darkTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') === 'dark' ||
             document.body.className.includes('dark');
    });
    expect(darkTheme).toBeTruthy();
    
    // Navigate to Projects with dark theme
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Projects' }).first().click();
    }
    
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#ProjInProgress, #ProjComplete');
    }, { timeout: 15000 });
    
    // Verify theme persisted
    const themeStillDark = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') === 'dark' ||
             document.body.className.includes('dark');
    });
    expect(themeStillDark).toBeTruthy();
    
    // Toggle back to light mode
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('#mobile-theme-toggle, [data-theme-toggle]').click();
    } else {
      await page.locator('#theme-toggle, [data-theme-toggle]').click();
    }
    
    await page.waitForTimeout(500);
    
    // Verify light theme applied
    const lightTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') === 'light' ||
             !document.body.className.includes('dark');
    });
    expect(lightTheme).toBeTruthy();
  });

  test('complete user journey: view documentation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for initial content
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Docs
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click();
    } else {
      // Click on Docs dropdown or link
      await page.locator('#navbar-links a:has-text("Docs"), #navbar-links a:has-text("Notes")').first().click();
    }
    
    // Wait for docs to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || c?.textContent?.length > 100;
    }, { timeout: 15000 });
    
    // Verify docs page loaded
    const docsContent = page.locator('#content');
    await expect(docsContent).toBeVisible();
    
    // Click on a category card if available
    const categoryCard = page.locator('.category-card, .docs-category').first();
    if (await categoryCard.count() > 0) {
      await categoryCard.click();
      
      // Wait for category content
      await page.waitForFunction(() => {
        const c = document.querySelector('#content');
        return c?.getAttribute('data-content-loaded') === 'true' || c?.textContent?.length > 100;
      }, { timeout: 15000 });
      
      // Verify category content loaded
      const categoryContent = page.locator('#content');
      await expect(categoryContent).toBeVisible();
    }
  });

  test('complete user journey: mobile navigation flow', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for initial content
    await page.waitForFunction(() => {
      return document.querySelector('#content') !== null;
    }, { timeout: 15000 });
    
    // Open mobile menu
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
    
    // Verify sidebar is visible
    const sidebar = page.locator('#mobile-sidebar');
    await expect(sidebar).toBeVisible();
    
    // Navigate to Projects
    await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    
    // Wait for projects to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#ProjInProgress, #ProjComplete');
    }, { timeout: 15000 });
    
    // Verify sidebar closed (should auto-close on navigation)
    const sidebarClosed = await page.evaluate(() => {
      const sidebar = document.querySelector('#mobile-sidebar');
      return !sidebar?.classList.contains('active');
    });
    expect(sidebarClosed).toBeTruthy();
    
    // Verify projects page loaded
    const projectsContent = page.locator('#content');
    await expect(projectsContent).toBeVisible();
  });
});

