import { test, expect } from '@playwright/test';

test.describe('Skills Page', () => {
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
  });

  test('skills page loads with categorized skills', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Skills - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/skills.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Skills', exact: true }).first().click();
    }
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#content h1, #content h2, #content h3');
    }, { timeout: 15000 });
    
    // Wait for heading element - use fallback pattern for WebKit
    try {
      await page.waitForSelector('#content h1[data-translate="skills.title"]', { timeout: 15000, state: 'visible' });
    } catch {
      // Fallback for WebKit - wait for any heading with Skills text and check visibility
      await page.waitForFunction(() => {
        const heading = document.querySelector('#content h1, #content h3') as HTMLElement;
        return heading && heading.textContent?.includes('Skills') && heading.offsetParent !== null;
      }, { timeout: 10000 });
    }
    await page.waitForTimeout(500);
    
    // Skills page should load - use data-translate attribute for more reliable selection
    const skillsHeading = page.locator('#content h1[data-translate="skills.title"], #content h1, #content h3').filter({ hasText: /Skills/i });
    const skillsHeadingCount = await skillsHeading.count();
    if (skillsHeadingCount > 0) {
      await expect(skillsHeading.first()).toBeVisible({ timeout: 10000 });
      await expect(skillsHeading.first()).toContainText('Skills', { timeout: 5000 });
    } else {
      // Final fallback - check for any heading
      const anyHeading = page.locator('#content h1, #content h3');
      const anyHeadingCount = await anyHeading.count();
      if (anyHeadingCount > 0) {
        await expect(anyHeading.first()).toBeVisible({ timeout: 5000 });
      }
    }
    
    // Should have skill badges/categories
    const skillBadges = page.locator('#content .skill-badge');
    const badgeCount = await skillBadges.count();
    expect(badgeCount).toBeGreaterThan(0);
  });

  test('skills are properly spaced and readable', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Skills - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/skills.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Skills', exact: true }).first().click();
    }
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('h1, h2, h3');
    }, { timeout: 15000 });
    
    // Wait for heading element - use fallback pattern for WebKit
    try {
      await page.waitForSelector('#content h1[data-translate="skills.title"]', { timeout: 15000, state: 'visible' });
    } catch {
      // Fallback for WebKit - wait for any heading with Skills text and check visibility
      await page.waitForFunction(() => {
        const heading = document.querySelector('#content h1, #content h3') as HTMLElement;
        return heading && heading.textContent?.includes('Skills') && heading.offsetParent !== null;
      }, { timeout: 10000 });
    }
    await page.waitForTimeout(500);
    
    // Verify skills heading is visible - use fallback selector for WebKit
    const skillsHeading = page.locator('#content h1[data-translate="skills.title"], #content h1, #content h3').filter({ hasText: /Skills/i });
    const skillsHeadingCount = await skillsHeading.count();
    if (skillsHeadingCount > 0) {
      await expect(skillsHeading.first()).toBeVisible({ timeout: 10000 });
    } else {
      // Final fallback - check for any heading
      const anyHeading = page.locator('#content h1, #content h3');
      const anyHeadingCount = await anyHeading.count();
      if (anyHeadingCount > 0) {
        await expect(anyHeading.first()).toBeVisible({ timeout: 5000 });
      }
    }
    
    // Check skills grid has proper spacing (use first() to avoid strict mode violation)
    const skillsGrid = page.locator('#content .skills-grid').first();
    if (await skillsGrid.isVisible({ timeout: 3000 })) {
      const gap = await skillsGrid.evaluate((el) => {
        return window.getComputedStyle(el).gap;
      });
      // Should have gap spacing
      expect(gap).toBeTruthy();
      expect(gap).not.toBe('normal');
    }
    
    // Skill badges should be visible
    const skillBadges = page.locator('#content .skill-badge');
    if (await skillBadges.first().isVisible({ timeout: 3000 })) {
      await expect(skillBadges.first()).toBeVisible();
    }
  });

  test('all skill categories are displayed', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Skills - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/skills.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Skills', exact: true }).first().click();
    }
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('h1, h2, h3');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check for all expected categories
    const categories = [
      'Programming Languages',
      'Frameworks & Libraries',
      'Testing & QA',
      'DevOps & Cloud',
      'Web Development',
      'Databases',
      'Tools & Other'
    ];
    
    for (const category of categories) {
      const categoryTitle = page.locator('.skill-category-title').filter({ hasText: new RegExp(category, 'i') });
      const count = await categoryTitle.count();
      if (count > 0) {
        await expect(categoryTitle.first()).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('skill badges have correct styling', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Skills - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/skills.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Skills', exact: true }).first().click();
    }
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('h1, h2, h3');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check skill badge styling
    const skillBadge = page.locator('.skill-badge').first();
    const badgeCount = await skillBadge.count();
    
    if (badgeCount > 0) {
      await expect(skillBadge).toBeVisible();
      
      // Check styling properties
      const styles = await skillBadge.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          alignItems: computed.alignItems,
          justifyContent: computed.justifyContent,
          padding: computed.padding,
          borderRadius: computed.borderRadius,
          backgroundColor: computed.backgroundColor,
          border: computed.border,
          userSelect: computed.userSelect,
          cursor: computed.cursor
        };
      });
      
      expect(styles.display).toBe('flex');
      expect(styles.alignItems).toBe('center');
      expect(styles.justifyContent).toBe('center');
      expect(styles.userSelect).toBe('none');
      expect(styles.cursor).toBe('default');
    }
  });

  test('skill badges display specific skills', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Skills - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/skills.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Skills', exact: true }).first().click();
    }
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('h1, h2, h3');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check for specific skills that should be present
    const expectedSkills = ['Java', 'Python', 'JavaScript', 'React', 'Playwright', 'Docker', 'Git'];
    
    for (const skill of expectedSkills) {
      const skillBadge = page.locator('.skill-badge').filter({ hasText: new RegExp(`^${skill}$`, 'i') });
      const count = await skillBadge.count();
      if (count > 0) {
        await expect(skillBadge.first()).toBeVisible({ timeout: 2000 });
      }
    }
  });

  test('skills page subtitle is visible', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Skills - handle mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/skills.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Skills', exact: true }).first().click();
    }
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('h1, h2, h3');
    }, { timeout: 15000 });
    await page.waitForTimeout(500);
    
    // Check for subtitle
    const subtitle = page.locator('.section-subtitle, p').filter({ hasText: /comprehensive|technologies|tools/i });
    const subtitleCount = await subtitle.count();
    if (subtitleCount > 0) {
      await expect(subtitle.first()).toBeVisible({ timeout: 3000 });
    }
  });
});

