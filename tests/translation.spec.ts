import { test, expect } from '@playwright/test';

test.describe('Translation feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for content to load
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
  });

  test('language switcher is visible in navbar', async ({ page }) => {
    await page.goto('/');
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      // On mobile, language switcher is in sidebar - open it first
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      
      const languageSwitcher = page.locator('#mobile-language-switcher');
      await expect(languageSwitcher).toBeVisible();
      
      const enButton = languageSwitcher.locator('button[data-lang="en"]');
      const esButton = languageSwitcher.locator('button[data-lang="es"]');
      
      await expect(enButton).toBeVisible();
      await expect(esButton).toBeVisible();
      await expect(enButton).toHaveText('EN');
      await expect(esButton).toHaveText('ES');
    } else {
      // Desktop: language switcher is in navbar
      const languageSwitcher = page.locator('#language-switcher');
      await expect(languageSwitcher).toBeVisible();
      
      const enButton = languageSwitcher.locator('button[data-lang="en"]');
      const esButton = languageSwitcher.locator('button[data-lang="es"]');
      
      await expect(enButton).toBeVisible();
      await expect(esButton).toBeVisible();
      await expect(enButton).toHaveText('EN');
      await expect(esButton).toHaveText('ES');
    }
  });

  test('mobile sidebar setting labels are visible and translated', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForSelector('nav.navbar', { state: 'attached' });
    
    // Open mobile sidebar
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForSelector('#mobile-sidebar.active', { timeout: 2000 });
    
    // Check that setting labels are visible in English (default)
    const languageLabel = page.locator('.mobile-setting-label[data-translate="settings.language"]');
    const themeLabel = page.locator('.mobile-setting-label[data-translate="settings.theme"]');
    
    await expect(languageLabel).toBeVisible();
    await expect(themeLabel).toBeVisible();
    await expect(languageLabel).toHaveText('Language');
    await expect(themeLabel).toHaveText('Theme');
    
    // Switch to Spanish
    const esButton = page.locator('#mobile-language-switcher button[data-lang="es"]');
    await esButton.click();
    await page.waitForTimeout(500);
    
    // Check that labels are translated to Spanish
    await expect(languageLabel).toHaveText('Idioma');
    await expect(themeLabel).toHaveText('Tema');
    
    // Switch back to English
    const enButton = page.locator('#mobile-language-switcher button[data-lang="en"]');
    await enButton.click();
    await page.waitForTimeout(500);
    
    // Check that labels are back to English
    await expect(languageLabel).toHaveText('Language');
    await expect(themeLabel).toHaveText('Theme');
  });

  test('default language is English', async ({ page }) => {
    await page.goto('/');
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      // On mobile, open sidebar to access language switcher
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      
      const enButton = page.locator('#mobile-language-switcher button[data-lang="en"]');
      const isActive = await enButton.getAttribute('aria-pressed');
      expect(isActive).toBe('true');
      
      // Check that English text is displayed in sidebar
      const homeLink = page.locator('.mobile-nav-item[data-translate="nav.home"]');
      await expect(homeLink).toHaveText('Home');
    } else {
      const enButton = page.locator('#language-switcher button[data-lang="en"]');
      const isActive = await enButton.getAttribute('aria-pressed');
      expect(isActive).toBe('true');
      
      // Check that English text is displayed - use navbar-links to avoid mobile sidebar
      const homeLink = page.locator('#navbar-links a[data-translate="nav.home"]').first();
      await expect(homeLink).toHaveText('Home');
    }
  });

  test('can switch to Spanish', async ({ page }) => {
    await page.goto('/');
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      // On mobile, open sidebar to access language switcher
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      
      const esButton = page.locator('#mobile-language-switcher button[data-lang="es"]');
      await esButton.click();
      
      // Wait for translation to apply
      await page.waitForTimeout(500);
      
      // Check that Spanish text is displayed in sidebar
      const homeLink = page.locator('.mobile-nav-item[data-translate="nav.home"]');
      await expect(homeLink).toHaveText('Inicio');
      
      // Check that ES button is now active
      const isActive = await esButton.getAttribute('aria-pressed');
      expect(isActive).toBe('true');
    } else {
      const esButton = page.locator('#language-switcher button[data-lang="es"]');
      await esButton.click();
      
      // Wait for translation to apply
      await page.waitForTimeout(500);
      
      // Check that Spanish text is displayed - use navbar-links to avoid mobile sidebar
      const homeLink = page.locator('#navbar-links a[data-translate="nav.home"]').or(page.locator('nav.navbar a[data-translate="nav.home"]').first());
      await expect(homeLink.first()).toHaveText('Inicio');
      
      const projectsLink = page.locator('#navbar-links a[data-translate="nav.projects"]').or(page.locator('nav.navbar a[data-translate="nav.projects"]').first());
      await expect(projectsLink.first()).toHaveText('Proyectos');
      
      // Check that ES button is now active
      const isActive = await esButton.getAttribute('aria-pressed');
      expect(isActive).toBe('true');
    }
  });

  test('can switch back to English', async ({ page }) => {
    await page.goto('/');
    
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    if (isMobile) {
      // On mobile, open sidebar to access language switcher
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      
      // Switch to Spanish first
      const esButton = page.locator('#mobile-language-switcher button[data-lang="es"]');
      await esButton.click();
      await page.waitForTimeout(500);
      
      // Switch back to English
      const enButton = page.locator('#mobile-language-switcher button[data-lang="en"]');
      await enButton.click();
      await page.waitForTimeout(500);
      
      // Check that English text is displayed in sidebar
      const homeLink = page.locator('.mobile-nav-item[data-translate="nav.home"]');
      await expect(homeLink).toHaveText('Home');
      
      const isActive = await enButton.getAttribute('aria-pressed');
      expect(isActive).toBe('true');
    } else {
      // Switch to Spanish first
      const esButton = page.locator('#language-switcher button[data-lang="es"]');
      await esButton.click();
      await page.waitForTimeout(500);
      
      // Switch back to English
      const enButton = page.locator('#language-switcher button[data-lang="en"]');
      await enButton.click();
      await page.waitForTimeout(500);
      
      // Check that English text is displayed - use navbar-links to avoid mobile sidebar
      const homeLink = page.locator('#navbar-links a[data-translate="nav.home"]').first();
      await expect(homeLink).toHaveText('Home');
      
      const isActive = await enButton.getAttribute('aria-pressed');
      expect(isActive).toBe('true');
    }
  });

  test('translations persist when navigating between pages', async ({ page }) => {
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Switch to Spanish
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      const esButton = page.locator('#mobile-language-switcher button[data-lang="es"]');
      await esButton.click();
    } else {
      const esButton = page.locator('#language-switcher button[data-lang="es"]');
      await esButton.click();
    }
    await page.waitForTimeout(500);
    
    // Navigate to Projects page - use navbar-links for desktop, mobile sidebar for mobile
    if (isMobile) {
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Proyectos' }).first().click();
    }
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    
    // Wait for heading element to exist and translations to apply - use longer timeout for CI
    await page.waitForSelector('#content h1[data-translate="projects.heading"]', { timeout: 15000, state: 'attached' });
    await page.waitForTimeout(500);
    
    // Check that Projects page is in Spanish
    const projectsTitle = page.locator('#content h1[data-translate="projects.heading"]');
    await expect(projectsTitle).toBeVisible({ timeout: 3000 });
    await expect(projectsTitle).toHaveText('Proyectos', { timeout: 3000 });
    
    // Navigate back to Home - use navbar-links for desktop, RM brand or mobile sidebar for mobile
    if (isMobile) {
      // Sidebar auto-closes when clicking nav items (confirmed in index.html line 149)
      // So we don't need to close it - just wait a bit and click RM brand
      await page.waitForTimeout(300);
      // Use RM brand to go home
      await page.locator('.navbar-brand-name').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Inicio' }).first().click();
    }
    
    // Wait for content to load - use waitForFunction for better reliability on iPhone
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Wait for homeBanner element - be lenient for WebKit/iPhone emulation
    // Try homeBanner first, but fall back to other home indicators
    try {
      await page.waitForSelector('#content #homeBanner', { timeout: 10000, state: 'attached' });
    } catch {
      // If homeBanner doesn't appear, try other home page indicators
      try {
        await page.waitForSelector('#content .hero-content, #content .hero-text-column', { timeout: 10000, state: 'attached' });
      } catch {
        // Last resort: just wait a bit and continue
        await page.waitForTimeout(1000);
      }
    }
    await page.waitForTimeout(500);
    
    // Check that Home page is still in Spanish - increased timeout for iPhone
    const homeTagline = page.locator('#content .hero-title-accent[data-translate="home.tagline"]');
    await expect(homeTagline).toBeVisible({ timeout: 10000 });
    await expect(homeTagline).toContainText('No te repitas', { timeout: 5000 });
  });

  test('home page content translates correctly', async ({ page }) => {
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Switch to Spanish
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      const esButton = page.locator('#mobile-language-switcher button[data-lang="es"]');
      await esButton.click();
    } else {
      const esButton = page.locator('#language-switcher button[data-lang="es"]');
      await esButton.click();
    }
    await page.waitForTimeout(500);
    
    // Check page title
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Inicio');
    
    // Check hero section
    const tagline = page.locator('#content .hero-title-accent[data-translate="home.tagline"]');
    await expect(tagline).toContainText('No te repitas');
    
    const description = page.locator('#content .hero-description[data-translate="home.description"]');
    await expect(description).toContainText('Desarrollador');
    
    // Check About Me section
    const aboutMe = page.locator('#content h2[data-translate="home.aboutMe"]');
    await expect(aboutMe).toHaveText('Acerca de mí');
    
    // Check Tech Stack section
    const techStack = page.locator('#content h2[data-translate="home.techStack"]');
    await expect(techStack).toHaveText('Stack Tecnológico');
  });

  test('projects page translates correctly', async ({ page }) => {
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Switch to Spanish
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      const esButton = page.locator('#mobile-language-switcher button[data-lang="es"]');
      await esButton.click();
    } else {
      const esButton = page.locator('#language-switcher button[data-lang="es"]');
      await esButton.click();
    }
    await page.waitForTimeout(500);
    
    // Navigate to Projects - use navbar-links for desktop, mobile sidebar for mobile
    if (isMobile) {
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Proyectos' }).first().click();
    }
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!document.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    
    // Wait for heading element to exist in DOM (it's in the static HTML that gets loaded)
    // Use waitForSelector instead of waitForFunction for better WebKit reliability
    try {
      await page.waitForSelector('#content h1[data-translate="skills.title"]', { timeout: 10000, state: 'attached' });
    } catch {
      // Fallback: wait for any h1 or h3, then wait for translation to apply
      await page.waitForSelector('#content h1, #content h3', { timeout: 10000, state: 'attached' });
    }
    await page.waitForTimeout(500);
    
    // Check translations - page title doesn't update in SPA navigation, so check content instead
    const title = page.locator('#content h1[data-translate="projects.heading"]');
    await expect(title).toBeVisible({ timeout: 10000 });
    
    // Check translations
    await expect(title).toHaveText('Proyectos');
    
    const inProgress = page.locator('#content h2[data-translate="projects.inProgress"]');
    await expect(inProgress).toHaveText('En Progreso');
    
    const complete = page.locator('#content h2[data-translate="projects.complete"]');
    await expect(complete).toHaveText('Completado');
  });

  test('skills page translates correctly', async ({ page }) => {
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Switch to Spanish
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      const esButton = page.locator('#mobile-language-switcher button[data-lang="es"]');
      await esButton.click();
      await page.waitForTimeout(300);
      // Navigate to Skills
      await page.locator('.mobile-nav-item[data-url="html/pages/skills.html"]').click();
    } else {
      const esButton = page.locator('#language-switcher button[data-lang="es"]');
      await esButton.click();
      await page.waitForTimeout(500);
      // Navigate to Skills (use navbar scoped locator to avoid home page button)
      await page.locator('nav.navbar').getByRole('link', { name: 'Habilidades' }).click();
    }
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('h1, h3');
    }, { timeout: 15000 });
    
    // Wait for heading element to exist in DOM first - use attached state for better reliability
    await page.waitForSelector('#content h1[data-translate="skills.title"]', { timeout: 15000, state: 'attached' });
    
    // Wait for translation to be applied - check that it's actually in Spanish
    await page.waitForFunction(() => {
      const heading = document.querySelector('#content h1[data-translate="skills.title"]');
      if (!heading) return false;
      const text = heading.textContent?.trim() || '';
      // Wait until it's translated to Spanish (contains "Habilidades")
      return text.includes('Habilidades');
    }, { timeout: 10000 });
    
    // Check translations - page title doesn't update in SPA navigation, so check content instead
    const title = page.locator('#content h1[data-translate="skills.title"]');
    await expect(title).toBeVisible({ timeout: 10000 });
    await expect(title).toContainText('Habilidades', { timeout: 5000 });
    
    const programmingLang = page.locator('#content h3[data-translate="skills.programmingLanguages"]');
    await expect(programmingLang).toHaveText('Lenguajes de Programación');
    
    const frameworks = page.locator('#content h3[data-translate="skills.frameworksLibraries"]');
    await expect(frameworks).toHaveText('Frameworks y Bibliotecas');
  });

  test('contact page translates correctly', async ({ page }) => {
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Switch to Spanish
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      const esButton = page.locator('#mobile-language-switcher button[data-lang="es"]');
      await esButton.click();
    } else {
      const esButton = page.locator('#language-switcher button[data-lang="es"]');
      await esButton.click();
    }
    await page.waitForTimeout(500);
    
    // Navigate to Contact - use navbar-links for desktop, mobile sidebar for mobile
    if (isMobile) {
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Contacto' }).first().click();
    }
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#contact-form');
    }, { timeout: 15000 });
    
    // Wait a bit for translations to apply
    await page.waitForTimeout(300);
    
    // Check page title
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Contáctame');
    
    // Check page title and subtitle
    const title = page.locator('#content h1[data-translate="contact.title"]');
    await expect(title).toContainText('Contáctame');
    
    const subtitle = page.locator('#content p[data-translate="contact.subtitle"]');
    await expect(subtitle).toContainText('¿Tienes una pregunta');
    
    // Check all labels
    const nameLabel = page.locator('#content label[for="name"][data-translate="contact.name"]');
    await expect(nameLabel).toContainText('Nombre');
    // Verify label preserves HTML (asterisk)
    const nameLabelHtml = await nameLabel.innerHTML();
    expect(nameLabelHtml).toContain('<span');
    
    const emailLabel = page.locator('#content label[for="email"][data-translate="contact.email"]');
    await expect(emailLabel).toContainText('Correo electrónico');
    
    const subjectLabel = page.locator('#content label[for="subject"][data-translate="contact.subject"]');
    await expect(subjectLabel).toContainText('Asunto');
    
    const messageLabel = page.locator('#content label[for="message"][data-translate="contact.message"]');
    await expect(messageLabel).toContainText('Mensaje');
    
    // Check all placeholders
    const nameInput = page.locator('#content input#name');
    const namePlaceholder = await nameInput.getAttribute('placeholder');
    expect(namePlaceholder).toBe('Tu nombre');
    
    const emailInput = page.locator('#content input#email');
    const emailPlaceholder = await emailInput.getAttribute('placeholder');
    expect(emailPlaceholder).toBe('tu.correo@ejemplo.com');
    
    const subjectInput = page.locator('#content input#subject');
    const subjectPlaceholder = await subjectInput.getAttribute('placeholder');
    expect(subjectPlaceholder).toBe('¿De qué se trata?');
    
    const messageTextarea = page.locator('#content textarea#message');
    const messagePlaceholder = await messageTextarea.getAttribute('placeholder');
    expect(messagePlaceholder).toBe('Dime qué tienes en mente...');
    
    // Check help text
    const requiredText = page.locator('#content .form-text[data-translate="contact.required"]');
    const requiredCount = await requiredText.count();
    expect(requiredCount).toBeGreaterThan(0);
    await expect(requiredText.first()).toHaveText('Requerido');
    
    const emailNote = page.locator('#content .form-text[data-translate="contact.emailNote"]');
    await expect(emailNote).toContainText('Nunca compartiremos tu correo electrónico');
    
    const messageNote = page.locator('#content .form-text[data-translate="contact.messageNote"]');
    await expect(messageNote).toContainText('Máximo 2000 caracteres');
    
    // Check submit button
    const submitButton = page.locator('#content #submit-text[data-translate="contact.sendMessage"]');
    await expect(submitButton).toHaveText('Enviar Mensaje');
  });
  
  test('contact page placeholders translate when switching languages', async ({ page }) => {
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Navigate to Contact page first - use navbar-links for desktop, mobile sidebar for mobile
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.locator('.mobile-nav-item[data-url="html/pages/contact.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Contact' }).first().click();
    }
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#contact-form');
    }, { timeout: 15000 });
    
    // Wait for inputs to be visible and translations to apply
    const nameInput = page.locator('#content input#name');
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(500);
    
    // Check English placeholders
    let namePlaceholder = await nameInput.getAttribute('placeholder');
    expect(namePlaceholder).toBe('Your name');
    
    // Switch to Spanish - handle mobile (sidebar might be closed after navigation)
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      const esButton = page.locator('#mobile-language-switcher button[data-lang="es"]');
      await esButton.click();
    } else {
      const esButton = page.locator('#language-switcher button[data-lang="es"]');
      await esButton.click();
    }
    await page.waitForTimeout(500);
    
    // Check Spanish placeholders
    namePlaceholder = await nameInput.getAttribute('placeholder');
    expect(namePlaceholder).toBe('Tu nombre');
    
    const emailInput = page.locator('#content input#email');
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    const emailPlaceholder = await emailInput.getAttribute('placeholder');
    expect(emailPlaceholder).toBe('tu.correo@ejemplo.com');
    
    // Switch back to English - handle mobile
    if (isMobile) {
      const enButton = page.locator('#mobile-language-switcher button[data-lang="en"]');
      await enButton.click();
    } else {
      const enButton = page.locator('#language-switcher button[data-lang="en"]');
      await enButton.click();
    }
    await page.waitForTimeout(500);
    
    // Verify placeholders are back to English
    namePlaceholder = await nameInput.getAttribute('placeholder');
    expect(namePlaceholder).toBe('Your name');
  });
  
  test('project descriptions translate but names do not', async ({ page }) => {
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Switch to Spanish
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      const esButton = page.locator('#mobile-language-switcher button[data-lang="es"]');
      await esButton.click();
    } else {
      const esButton = page.locator('#language-switcher button[data-lang="es"]');
      await esButton.click();
    }
    await page.waitForTimeout(500);
    
    // Navigate to Projects - use navbar-links for desktop, mobile sidebar for mobile
    if (isMobile) {
      await page.locator('.mobile-nav-item[data-url="html/pages/projects.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Proyectos' }).first().click();
    }
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!document.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    
    // Wait for projects to load
    await page.waitForTimeout(2000);
    
    // Check that project names are NOT translated (should remain in English)
    const projectCards = page.locator('#content .project-card');
    const cardCount = await projectCards.count();
    
    if (cardCount > 0) {
      const firstCard = projectCards.first();
      const projectName = firstCard.locator('.card-title[data-no-translate="true"]');
      const nameText = await projectName.textContent();
      
      // Project names should be in English (original), not Spanish
      // Common project names that shouldn't be translated
      expect(nameText).toBeTruthy();
      // Verify it's not a Spanish translation of a common word
      if (nameText) {
        expect(nameText).not.toBe('Administrador Azul'); // Should be "Blue Manager"
        expect(nameText).not.toBe('Tránsito Xpress'); // Should be "Xpress Transit"
      }
      
      // Check that descriptions ARE translated
      const projectDescription = firstCard.locator('.card-text[data-translate^="projects.descriptions."]');
      const descriptionText = await projectDescription.textContent();
      expect(descriptionText).toBeTruthy();
      // Description should be in Spanish if we're in Spanish mode
      if (descriptionText && nameText?.includes('Blue Manager')) {
        expect(descriptionText).toContain('mantenimiento'); // Spanish word
      }
    }
  });

  test('docs page translates correctly', async ({ page }) => {
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Switch to Spanish
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      const esButton = page.locator('#mobile-language-switcher button[data-lang="es"]');
      await esButton.click();
    } else {
      const esButton = page.locator('#language-switcher button[data-lang="es"]');
      await esButton.click();
    }
    await page.waitForTimeout(500);
    
    // Navigate to Docs - mobile has direct link, desktop has dropdown
    if (isMobile) {
      await page.locator('.mobile-nav-item[data-url="html/pages/docs.html"]').click();
    } else {
      const docsButton = page.locator('#navbar-links').getByRole('button', { name: 'Documentos' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Documentos' })
      );
      await docsButton.hover();
      await page.getByRole('link', { name: 'Notas' }).click();
    }
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('.notes-category-card');
    }, { timeout: 15000 });
    await page.waitForTimeout(300);
    
    // Check page title
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Documentos');
    
    // Check translations in the new card-based design
    const notesTitle = page.locator('#content .notes-title[data-translate="docs.notes"]');
    await expect(notesTitle).toHaveText('Notas');
    
    const pythonCardTitle = page.locator('#content .notes-card-title[data-translate="docs.python"]');
    await expect(pythonCardTitle).toHaveText('Python');
    
    const gitCardTitle = page.locator('#content .notes-card-title[data-translate="docs.git"]');
    await expect(gitCardTitle).toHaveText('Git');
    
    const miscCardTitle = page.locator('#content .notes-card-title[data-translate="docs.misc"]');
    await expect(miscCardTitle).toHaveText('Misc.');
    
    const welcomeTitle = page.locator('#content .notes-welcome-title[data-translate="docs.clickToStart"]');
    await expect(welcomeTitle).toContainText('Haz clic en cualquier categoría');
  });
  
  test('tutorials page translates correctly', async ({ page }) => {
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Switch to Spanish
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      const esButton = page.locator('#mobile-language-switcher button[data-lang="es"]');
      await esButton.click();
    } else {
      const esButton = page.locator('#language-switcher button[data-lang="es"]');
      await esButton.click();
    }
    await page.waitForTimeout(500);
    
    // Navigate to Tutorials - use navbar-links for desktop, mobile sidebar for mobile
    if (isMobile) {
      await page.locator('.mobile-nav-item[data-url="html/pages/tutorials.html"]').click();
    } else {
      await page.locator('#navbar-links').getByRole('link', { name: 'Tutoriales' }).first().click();
    }
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#content h1');
    }, { timeout: 15000 });
    // Wait for heading element to exist in DOM - use waitForSelector for better WebKit reliability
    await page.waitForSelector('#content h1[data-translate="tutorials.heading"]', { timeout: 15000, state: 'attached' });
    await page.waitForTimeout(500);
    
    // Check translations - page title doesn't update in SPA navigation, so check content instead
    const title = page.locator('#content h1[data-translate="tutorials.heading"]');
    await expect(title).toBeVisible({ timeout: 10000 });
    await expect(title).toHaveText('Tutoriales', { timeout: 5000 });
    
    const subtitle = page.locator('#content p[data-translate="tutorials.subtitle"]');
    await expect(subtitle).toContainText('Directorio de todos los tutoriales');
    
    const pythonTutorial = page.locator('#content h3[data-translate="tutorials.pythonTutorial"]');
    await expect(pythonTutorial).toHaveText('Tutorial de Python');
    
    const codingChallenges = page.locator('#content h3[data-translate="tutorials.codingChallenges"]');
    await expect(codingChallenges).toHaveText('Desafíos de Programación');
    
    const viewLessons = page.locator('#content a[data-translate="tutorials.viewLessons"]');
    await expect(viewLessons).toHaveText('Ver Lecciones →');
    
    const viewChallenges = page.locator('#content a[data-translate="tutorials.viewChallenges"]');
    await expect(viewChallenges).toHaveText('Ver Desafíos →');
  });


  test('language preference persists after page reload', async ({ page }) => {
    // Check if we're on mobile
    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    
    // Switch to Spanish
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      const esButton = page.locator('#mobile-language-switcher button[data-lang="es"]');
      await esButton.click();
    } else {
      const esButton = page.locator('#language-switcher button[data-lang="es"]');
      await esButton.click();
    }
    await page.waitForTimeout(500);
    
    // Reload page
    await page.reload();
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Wait for TranslationManager to reinitialize after reload
    await page.waitForFunction(() => {
      return typeof window.TranslationManager !== 'undefined' && 
             window.TranslationManager.currentLanguage !== undefined;
    }, { timeout: 5000 });
    await page.waitForTimeout(500);
    
    // Check that Spanish is still selected
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      const esButtonAfterReload = page.locator('#mobile-language-switcher button[data-lang="es"]');
      await expect(esButtonAfterReload).toBeVisible({ timeout: 5000 });
      
      // Wait for language to be properly restored and applied
      await page.waitForFunction(() => {
        const button = document.querySelector('#mobile-language-switcher button[data-lang="es"]');
        return button && button.getAttribute('aria-pressed') === 'true';
      }, { timeout: 5000 });
      
      const isActive = await esButtonAfterReload.getAttribute('aria-pressed');
      expect(isActive).toBe('true');
      
      // Check that content is in Spanish
      const homeLink = page.locator('.mobile-nav-item[data-translate="nav.home"]');
      await expect(homeLink).toHaveText('Inicio');
    } else {
      const esButtonAfterReload = page.locator('#language-switcher button[data-lang="es"]');
      await expect(esButtonAfterReload).toBeVisible({ timeout: 5000 });
      
      // Wait for language to be properly restored and applied
      await page.waitForFunction(() => {
        const button = document.querySelector('#language-switcher button[data-lang="es"]');
        return button && button.getAttribute('aria-pressed') === 'true';
      }, { timeout: 5000 });
      
      const isActive = await esButtonAfterReload.getAttribute('aria-pressed');
      expect(isActive).toBe('true');
      
      // Check that content is in Spanish - use navbar-links to avoid mobile sidebar
      const homeLink = page.locator('#navbar-links a[data-translate="nav.home"]').first();
      await expect(homeLink).toHaveText('Inicio');
    }
  });
});

