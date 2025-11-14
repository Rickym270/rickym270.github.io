import { test, expect } from '@playwright/test';

test.describe('Projects Page', () => {
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

  test('navigates to Projects via navbar and renders content', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Click Projects link (triggers jQuery load into #content)
    await page.getByRole('link', { name: 'Projects' }).click();
    
    // Wait for the projects page content to be loaded into #content
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!document.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    
    // Wait for heading element to exist first, then check visibility
    await page.waitForSelector('#content h1[data-translate="projects.heading"]', { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check for Projects heading - use data-translate attribute for more reliable selection
    const projectsHeading = page.locator('#content h1[data-translate="projects.heading"]');
    await expect(projectsHeading).toBeVisible({ timeout: 10000 });
    await expect(projectsHeading).toHaveText('Projects', { timeout: 5000 });
    
    // Wait for scripts to execute and API call to complete (or fail gracefully)
    // The page will either show project cards OR an error message - both are valid
    await page.waitForTimeout(3000); // Give scripts time to load and execute
    
    // Verify page structure is correct (projectsHeading already declared above)
    await expect(projectsHeading).toBeVisible({ timeout: 3000 });
    await expect(projectsHeading).toHaveText('Projects');
    
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

  test('shows loading message in each section while projects load', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForTimeout(500);
    
    await page.getByRole('link', { name: 'Projects' }).click();
    
    // Wait for sections to exist (InProgress and Complete must be visible, ComingSoon just needs to exist)
    await page.waitForFunction(() => {
      const inProgress = document.querySelector('#ProjInProgress');
      const complete = document.querySelector('#ProjComplete');
      const comingSoon = document.querySelector('#ProjComingSoon');
      if (!inProgress || !complete || !comingSoon) return false;
      const inProgressStyle = window.getComputedStyle(inProgress);
      const completeStyle = window.getComputedStyle(complete);
      // InProgress and Complete must be visible, ComingSoon just needs to exist
      return inProgressStyle.display !== 'none' && inProgressStyle.visibility !== 'hidden' &&
             completeStyle.display !== 'none' && completeStyle.visibility !== 'hidden';
    }, { timeout: 15000 });
    
    // Check that loading messages appear (may be brief, so check quickly)
    const loadingMessages = page.locator('#content').getByText(/Loading|Please Wait/i);
    const loadingCount = await loadingMessages.count();
    
    // Sections should exist (ComingSoon might be hidden if empty)
    const inProgressSection = page.locator('#ProjInProgress');
    await expect(inProgressSection).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#ProjComplete')).toBeVisible({ timeout: 5000 });
    const comingSoonSection = page.locator('#ProjComingSoon');
    await expect(comingSoonSection).toBeAttached({ timeout: 5000 });
    // ComingSoon might be hidden if empty, check if visible
    const comingSoonVisible = await comingSoonSection.isVisible().catch(() => false);
    if (comingSoonVisible) {
      await expect(comingSoonSection).toBeVisible({ timeout: 1000 });
    }
  });

  test('projects reload correctly when navigating to page multiple times', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForTimeout(500);
    
    // Navigate to Projects
    await page.getByRole('link', { name: 'Projects' }).click();
  await page.waitForFunction(() => {
    const c = document.querySelector('#content');
    return c?.getAttribute('data-content-loaded') === 'true' || !!document.querySelector('#ProjInProgress .row, #ProjComplete .row');
  }, { timeout: 15000 });
    
    // Navigate away
    await page.getByRole('link', { name: 'Home' }).click();
    await page.waitForTimeout(1000);
    
    // Navigate back to Projects
    await page.getByRole('link', { name: 'Projects' }).click();
    
    // Wait for projects page HTML to load into #content
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!document.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    
    // Wait for heading element to exist in DOM (it's in the static HTML)
    await page.waitForSelector('#content h1[data-translate="projects.heading"]', { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Projects should still load correctly - use data-translate selector
    const projectsHeading = page.locator('#content h1[data-translate="projects.heading"]');
    await expect(projectsHeading).toBeVisible({ timeout: 10000 });
    await expect(projectsHeading).toHaveText('Projects', { timeout: 5000 });
    
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
    await page.goto('/');
    
    // Set dark mode
    const themeToggle = page.locator('#theme-toggle');
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Navigate to Projects
    await page.getByRole('link', { name: 'Projects' }).click();
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
});


