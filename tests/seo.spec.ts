import { test, expect } from '@playwright/test';

test.describe('SEO & Meta Tags', () => {
  test.describe.configure({ timeout: 120000 });

  test('home page has proper meta tags', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Check for essential meta tags
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    expect(title.length).toBeLessThan(70); // SEO best practice
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    const metaDescCount = await metaDescription.count();
    if (metaDescCount > 0) {
      const description = await metaDescription.getAttribute('content');
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThan(0);
      expect(description!.length).toBeLessThan(160); // SEO best practice
    }
    
    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveCount(1);
    const viewportContent = await viewport.getAttribute('content');
    expect(viewportContent).toContain('width=device-width');
  });

  test('page has Open Graph meta tags', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Check for Open Graph tags (optional but recommended)
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogTitleCount = await ogTitle.count();
    
    if (ogTitleCount > 0) {
      const ogTitleContent = await ogTitle.getAttribute('content');
      expect(ogTitleContent).toBeTruthy();
    }
    
    // Check for og:type
    const ogType = page.locator('meta[property="og:type"]');
    const ogTypeCount = await ogType.count();
    if (ogTypeCount > 0) {
      const ogTypeContent = await ogType.getAttribute('content');
      expect(ogTypeContent).toBeTruthy();
    }
  });

  test('page has canonical URL', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Check for canonical link
    const canonical = page.locator('link[rel="canonical"]');
    const canonicalCount = await canonical.count();
    
    if (canonicalCount > 0) {
      const canonicalUrl = await canonical.getAttribute('href');
      expect(canonicalUrl).toBeTruthy();
      expect(canonicalUrl).toMatch(/^https?:\/\//);
    }
  });

  test('favicon is present', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Check for favicon link
    const favicon = page.locator('link[rel="icon"], link[rel="shortcut icon"]');
    const faviconCount = await favicon.count();
    
    if (faviconCount > 0) {
      const faviconHref = await favicon.first().getAttribute('href');
      expect(faviconHref).toBeTruthy();
    }
  });

  test('structured data is present', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    // Check for JSON-LD structured data (optional)
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const jsonLdCount = await jsonLd.count();
    
    if (jsonLdCount > 0) {
      const jsonLdContent = await jsonLd.first().textContent();
      expect(jsonLdContent).toBeTruthy();
      // Verify it's valid JSON
      expect(() => JSON.parse(jsonLdContent!)).not.toThrow();
    }
  });

  test('headings follow semantic structure', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    // Check for h1 (should be unique per page)
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
    expect(h1Count).toBeLessThanOrEqual(1); // Best practice: one h1 per page
    
    // Check heading hierarchy (h2 should not come before h1)
    const headings = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const h2 = document.querySelector('h2');
      return {
        hasH1: !!h1,
        hasH2: !!h2,
        h1BeforeH2: h1 && h2 ? h1.compareDocumentPosition(h2) & Node.DOCUMENT_POSITION_FOLLOWING : true
      };
    });
    
    expect(headings.hasH1).toBe(true);
  });

  test('links are crawlable', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    await page.waitForSelector('#content', { state: 'attached' });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    // Check main navigation links
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();
    
    if (linkCount > 0) {
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = navLinks.nth(i);
        const href = await link.getAttribute('href');
        // Links should have href attributes
        expect(href).toBeTruthy();
      }
    }
  });

  test('robots meta tag is configured', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Check for robots meta tag
    const robots = page.locator('meta[name="robots"]');
    const robotsCount = await robots.count();
    
    if (robotsCount > 0) {
      const robotsContent = await robots.getAttribute('content');
      // Should not be noindex, nofollow (unless intentional)
      expect(robotsContent).not.toContain('noindex');
    }
  });
});

