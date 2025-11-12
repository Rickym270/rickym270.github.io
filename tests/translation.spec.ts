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
    const languageSwitcher = page.locator('#language-switcher');
    await expect(languageSwitcher).toBeVisible();
    
    const enButton = languageSwitcher.locator('button[data-lang="en"]');
    const esButton = languageSwitcher.locator('button[data-lang="es"]');
    
    await expect(enButton).toBeVisible();
    await expect(esButton).toBeVisible();
    await expect(enButton).toHaveText('EN');
    await expect(esButton).toHaveText('ES');
  });

  test('default language is English', async ({ page }) => {
    const enButton = page.locator('#language-switcher button[data-lang="en"]');
    const isActive = await enButton.getAttribute('aria-pressed');
    expect(isActive).toBe('true');
    
    // Check that English text is displayed
    const homeLink = page.locator('nav a[data-translate="nav.home"]');
    await expect(homeLink).toHaveText('Home');
  });

  test('can switch to Spanish', async ({ page }) => {
    const esButton = page.locator('#language-switcher button[data-lang="es"]');
    
    await esButton.click();
    
    // Wait for translation to apply
    await page.waitForTimeout(500);
    
    // Check that Spanish text is displayed
    const homeLink = page.locator('nav a[data-translate="nav.home"]');
    await expect(homeLink).toHaveText('Inicio');
    
    const projectsLink = page.locator('nav a[data-translate="nav.projects"]');
    await expect(projectsLink).toHaveText('Proyectos');
    
    // Check that ES button is now active
    const isActive = await esButton.getAttribute('aria-pressed');
    expect(isActive).toBe('true');
  });

  test('can switch back to English', async ({ page }) => {
    // Switch to Spanish first
    const esButton = page.locator('#language-switcher button[data-lang="es"]');
    await esButton.click();
    await page.waitForTimeout(500);
    
    // Switch back to English
    const enButton = page.locator('#language-switcher button[data-lang="en"]');
    await enButton.click();
    await page.waitForTimeout(500);
    
    // Check that English text is displayed
    const homeLink = page.locator('nav a[data-translate="nav.home"]');
    await expect(homeLink).toHaveText('Home');
    
    const isActive = await enButton.getAttribute('aria-pressed');
    expect(isActive).toBe('true');
  });

  test('translations persist when navigating between pages', async ({ page }) => {
    // Switch to Spanish
    const esButton = page.locator('#language-switcher button[data-lang="es"]');
    await esButton.click();
    await page.waitForTimeout(500);
    
    // Navigate to Projects page
    await page.getByRole('link', { name: 'Proyectos' }).click();
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!document.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    
    // Check that Projects page is in Spanish
    const projectsTitle = page.locator('#content h1[data-translate="projects.title"]');
    await expect(projectsTitle).toHaveText('Proyectos');
    
    // Navigate back to Home
    await page.getByRole('link', { name: 'Inicio' }).click();
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check that Home page is still in Spanish
    const homeTagline = page.locator('#content .hero-title-accent[data-translate="home.tagline"]');
    await expect(homeTagline).toContainText('No te repitas');
  });

  test('home page content translates correctly', async ({ page }) => {
    // Switch to Spanish
    const esButton = page.locator('#language-switcher button[data-lang="es"]');
    await esButton.click();
    await page.waitForTimeout(500);
    
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
    // Switch to Spanish
    const esButton = page.locator('#language-switcher button[data-lang="es"]');
    await esButton.click();
    await page.waitForTimeout(500);
    
    // Navigate to Projects
    await page.getByRole('link', { name: 'Proyectos' }).click();
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!document.querySelector('#ProjInProgress .row, #ProjComplete .row');
    }, { timeout: 15000 });
    
    // Check translations
    const title = page.locator('#content h1[data-translate="projects.title"]');
    await expect(title).toHaveText('Proyectos');
    
    const inProgress = page.locator('#content h2[data-translate="projects.inProgress"]');
    await expect(inProgress).toHaveText('En Progreso');
    
    const complete = page.locator('#content h2[data-translate="projects.complete"]');
    await expect(complete).toHaveText('Completado');
  });

  test('skills page translates correctly', async ({ page }) => {
    // Switch to Spanish
    const esButton = page.locator('#language-switcher button[data-lang="es"]');
    await esButton.click();
    await page.waitForTimeout(500);
    
    // Navigate to Skills
    await page.getByRole('link', { name: 'Habilidades' }).click();
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#content h1, #content h3');
    }, { timeout: 15000 });
    
    // Check translations
    const title = page.locator('#content h1[data-translate="skills.title"]');
    await expect(title).toContainText('Habilidades');
    
    const programmingLang = page.locator('#content h3[data-translate="skills.programmingLanguages"]');
    await expect(programmingLang).toHaveText('Lenguajes de Programación');
    
    const frameworks = page.locator('#content h3[data-translate="skills.frameworksLibraries"]');
    await expect(frameworks).toHaveText('Frameworks y Bibliotecas');
  });

  test('contact page translates correctly', async ({ page }) => {
    // Switch to Spanish
    const esButton = page.locator('#language-switcher button[data-lang="es"]');
    await esButton.click();
    await page.waitForTimeout(500);
    
    // Navigate to Contact
    await page.getByRole('link', { name: 'Contacto' }).click();
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#contact-form');
    }, { timeout: 15000 });
    
    // Check translations
    const title = page.locator('#content h1[data-translate="contact.title"]');
    await expect(title).toContainText('Contáctame');
    
    const nameLabel = page.locator('#content label[for="name"][data-translate="contact.name"]');
    await expect(nameLabel).toContainText('Nombre');
    
    const emailLabel = page.locator('#content label[for="email"][data-translate="contact.email"]');
    await expect(emailLabel).toContainText('Correo electrónico');
    
    const submitButton = page.locator('#content #submit-text[data-translate="contact.sendMessage"]');
    await expect(submitButton).toHaveText('Enviar Mensaje');
    
    // Check placeholders
    const nameInput = page.locator('#content input#name');
    const namePlaceholder = await nameInput.getAttribute('placeholder');
    expect(namePlaceholder).toBe('Tu nombre');
  });

  test('language preference persists after page reload', async ({ page }) => {
    // Switch to Spanish
    const esButton = page.locator('#language-switcher button[data-lang="es"]');
    await esButton.click();
    await page.waitForTimeout(500);
    
    // Reload page
    await page.reload();
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });
    
    // Check that Spanish is still selected
    const esButtonAfterReload = page.locator('#language-switcher button[data-lang="es"]');
    const isActive = await esButtonAfterReload.getAttribute('aria-pressed');
    expect(isActive).toBe('true');
    
    // Check that content is in Spanish
    const homeLink = page.locator('nav a[data-translate="nav.home"]');
    await expect(homeLink).toHaveText('Inicio');
  });
});

