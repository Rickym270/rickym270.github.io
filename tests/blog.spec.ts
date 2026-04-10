import { test, expect } from '@playwright/test';

test.describe('Blog Pages', () => {
  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('siteLanguage', 'en');
    });
  });

  test('Engineering page loads via Blog dropdown', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('engineering.html') && (res.status() === 200 || res.status() === 304),
      { timeout: 20000 }
    );
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.evaluate(() => {
        const panel = document.getElementById('mobile-nav-panel-blog');
        if (panel) {
          panel.classList.add('mobile-nav-group-panel-open');
          panel.setAttribute('aria-hidden', 'false');
        }
      });
      const engineeringLink = page.locator('#mobile-nav-panel-blog').getByRole('link', { name: 'Engineering' });
      await engineeringLink.scrollIntoViewIfNeeded();
      await engineeringLink.click();
    } else {
      const blogButton = page.locator('#navbar-links').getByRole('button', { name: 'Blog' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Blog' })
      );
      await blogButton.hover();
      await page.locator('.dropdown-menu-blog').first().getByRole('link', { name: 'Engineering' }).click();
    }
    await responsePromise.catch(() => {});

    // Wait for engineering page content (h1 with "Engineering" or .blog-featured)
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      const h1 = c?.querySelector('h1');
      return (c?.getAttribute('data-content-loaded') === 'true' && h1 && /Engineering/i.test(h1.textContent || '')) || !!c?.querySelector('.blog-featured');
    }, { timeout: 15000 });

    const heading = page.locator('#content h1').filter({ hasText: /Engineering/i });
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText('Engineering');
  });

  test('Personal page loads via Blog dropdown', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.evaluate(() => {
        const panel = document.getElementById('mobile-nav-panel-blog');
        if (panel) {
          panel.classList.add('mobile-nav-group-panel-open');
          panel.setAttribute('aria-hidden', 'false');
        }
      });
      await page.locator('#mobile-nav-panel-blog').getByRole('link', { name: 'Personal' }).click();
    } else {
      const blogButton = page.locator('#navbar-links').getByRole('button', { name: 'Blog' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Blog' })
      );
      await blogButton.hover();
      await page.locator('.dropdown-menu-blog').first().getByRole('link', { name: 'Personal' }).click();
    }

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('h1');
    }, { timeout: 15000 });

    const heading = page.locator('#content h1').filter({ hasText: /Personal/i });
    await expect(heading).toBeVisible({ timeout: 5000 });
    await expect(heading).toContainText('Personal');
  });

  test('Engineering page shows Featured Post, Latest Insights, and blog cards', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.evaluate(() => {
        const panel = document.getElementById('mobile-nav-panel-blog');
        if (panel) {
          panel.classList.add('mobile-nav-group-panel-open');
          panel.setAttribute('aria-hidden', 'false');
        }
      });
      await page.locator('#mobile-nav-panel-blog').getByRole('link', { name: 'Engineering' }).click();
    } else {
      const blogButton = page.locator('#navbar-links').getByRole('button', { name: 'Blog' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Blog' })
      );
      await blogButton.hover();
      await page.locator('.dropdown-menu-blog').first().getByRole('link', { name: 'Engineering' }).click();
    }

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' && !!c?.querySelector('.blog-featured');
    }, { timeout: 15000 });

    const content = page.locator('#content');

    // Featured Post
    await expect(content.locator('.blog-featured')).toBeVisible();
    await expect(content.locator('.blog-featured')).toContainText('Accessibility Is Not Just a Feature');
    await expect(content.getByRole('link', { name: 'Read Article' })).toBeVisible();

    // Latest Insights: search bar (replaces pills)
    await expect(content.locator('h2').filter({ hasText: 'Latest Insights' })).toBeVisible();
    await expect(content.locator('.blog-category-pills')).toBeVisible();
    await expect(content.locator('.blog-search-wrap')).toBeVisible();
    await expect(content.locator('.blog-search-input')).toBeVisible();

    // Cards: four real cards (newest → oldest)
    const realCards = content.locator('.blog-card:not(.placeholder)');
    await expect(realCards).toHaveCount(4);
    await expect(realCards.first()).toContainText('Operating Under Constraint: Job Search With MS');
    await expect(content.locator('.blog-card a[data-url="html/pages/engineering/operating-under-constraint-job-search-with-ms.html"]').first()).toBeVisible();
    await expect(content.locator('.blog-card a[data-url="html/pages/engineering/building-tools-for-the-version-of-you-thats-running-low.html"]').first()).toBeVisible();
    await expect(content.locator('.blog-card a[data-url="html/pages/engineering/accessibility-is-not-just-a-feature.html"]').first()).toBeVisible();
    await expect(content.locator('.blog-card a[data-url="html/pages/engineering/how-living-with-ms-changed-the-way-i-engineer-software.html"]').first()).toBeVisible();
  });

  test('Personal page shows Coming Soon in Featured and placeholder cards', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.evaluate(() => {
        const panel = document.getElementById('mobile-nav-panel-blog');
        if (panel) {
          panel.classList.add('mobile-nav-group-panel-open');
          panel.setAttribute('aria-hidden', 'false');
        }
      });
      await page.locator('#mobile-nav-panel-blog').getByRole('link', { name: 'Personal' }).click();
    } else {
      const blogButton = page.locator('#navbar-links').getByRole('button', { name: 'Blog' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Blog' })
      );
      await blogButton.hover();
      await page.locator('.dropdown-menu-blog').first().getByRole('link', { name: 'Personal' }).click();
    }

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' && !!c?.querySelector('.blog-featured');
    }, { timeout: 15000 });

    const content = page.locator('#content');

    await expect(content.locator('.blog-featured')).toBeVisible();
    await expect(content.locator('.blog-featured')).toContainText('Coming Soon');

    await expect(content.locator('h2').filter({ hasText: 'Latest Insights' })).toBeVisible();
    await expect(content.locator('.blog-category-pills')).toBeVisible();
    await expect(content.locator('.blog-search-wrap')).toBeVisible();
    await expect(content.locator('.blog-search-input')).toBeVisible();

    const placeholderCards = content.locator('.blog-card.placeholder');
    await expect(placeholderCards).toHaveCount(3);
    await expect(content.locator('.blog-card').filter({ hasText: 'Coming Soon' }).first()).toBeVisible();
  });

  test('Latest Insights search filters cards by query', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('engineering.html') && (res.status() === 200 || res.status() === 304),
      { timeout: 20000 }
    );
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.evaluate(() => {
        const panel = document.getElementById('mobile-nav-panel-blog');
        if (panel) {
          panel.classList.add('mobile-nav-group-panel-open');
          panel.setAttribute('aria-hidden', 'false');
        }
      });
      await page.locator('#mobile-nav-panel-blog').getByRole('link', { name: 'Engineering' }).click();
    } else {
      const blogButton = page.locator('#navbar-links').getByRole('button', { name: 'Blog' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Blog' })
      );
      await blogButton.hover();
      await page.locator('.dropdown-menu-blog').first().getByRole('link', { name: 'Engineering' }).click();
    }
    await responsePromise.catch(() => {});

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' && !!c?.querySelector('.blog-featured');
    }, { timeout: 15000 });

    const content = page.locator('#content');
    const searchInput = content.locator('.blog-search-input');
    await expect(searchInput).toBeVisible();

    // Type a query; after debounce and API response either matching cards are visible or no-results is shown
    await searchInput.fill('accessibility');
    // Wait until the UI reacts (cards filtered or no-results shown). Network timing can vary in CI.
    await page.waitForFunction(() => {
      const content = document.querySelector('#content');
      const noResults = content?.querySelector('.blog-search-no-results') as HTMLElement | null;
      if (noResults && noResults.style.display !== 'none') return true;
      const cards = Array.from(content?.querySelectorAll('.blog-cards-grid .blog-card') || []) as HTMLElement[];
      return cards.some((c) => (c.style && c.style.display === 'none'));
    }, { timeout: 8000 });

    // Either at least one real card is visible (API returned results) or no-results message is shown (API error or no match)
    const visibleRealCards = await content.locator('.blog-card:not(.placeholder):visible').count();
    const hasNoResults = await content.locator('.blog-search-no-results').isVisible();
    expect(visibleRealCards > 0 || hasNoResults).toBeTruthy();

    // Clear search: grid restored (no-results hidden, all cards shown again)
    await searchInput.fill('');
    await expect(content.locator('.blog-search-no-results')).toBeHidden({ timeout: 5000 });
    await expect(searchInput).toHaveValue('');
    const gridCards = content.locator('.blog-cards-grid .blog-card');
    const totalCards = await gridCards.count();
    await expect(gridCards.first()).toBeVisible({ timeout: 3000 });
    await expect(gridCards).toHaveCount(totalCards);
  });

  test('Clearing search restores full card grid', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('engineering.html') && (res.status() === 200 || res.status() === 304),
      { timeout: 20000 }
    );
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.evaluate(() => {
        const panel = document.getElementById('mobile-nav-panel-blog');
        if (panel) {
          panel.classList.add('mobile-nav-group-panel-open');
          panel.setAttribute('aria-hidden', 'false');
        }
      });
      await page.locator('#mobile-nav-panel-blog').getByRole('link', { name: 'Engineering' }).click();
    } else {
      const blogButton = page.locator('#navbar-links').getByRole('button', { name: 'Blog' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Blog' })
      );
      await blogButton.hover();
      await page.locator('.dropdown-menu-blog').first().getByRole('link', { name: 'Engineering' }).click();
    }
    await responsePromise.catch(() => {});

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' && !!c?.querySelector('.blog-featured');
    }, { timeout: 15000 });

    const content = page.locator('#content');
    const searchInput = content.locator('.blog-search-input');
    const gridCards = content.locator('.blog-cards-grid .blog-card');
    const totalBefore = await gridCards.count();
    await expect(gridCards.first()).toBeVisible();

    await searchInput.fill('accessibility');
    await page.waitForTimeout(400);

    await searchInput.fill('');
    await page.waitForTimeout(100);
    await expect(content.locator('.blog-search-no-results')).toBeHidden({ timeout: 5000 });
    await expect(searchInput).toHaveValue('');
    await expect(gridCards).toHaveCount(totalBefore);
    await expect(gridCards.first()).toBeVisible();
  });

  test('Escape clears search and restores full card grid', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('engineering.html') && (res.status() === 200 || res.status() === 304),
      { timeout: 20000 }
    );
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.evaluate(() => {
        const panel = document.getElementById('mobile-nav-panel-blog');
        if (panel) {
          panel.classList.add('mobile-nav-group-panel-open');
          panel.setAttribute('aria-hidden', 'false');
        }
      });
      await page.locator('#mobile-nav-panel-blog').getByRole('link', { name: 'Engineering' }).click();
    } else {
      const blogButton = page.locator('#navbar-links').getByRole('button', { name: 'Blog' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Blog' })
      );
      await blogButton.hover();
      await page.locator('.dropdown-menu-blog').first().getByRole('link', { name: 'Engineering' }).click();
    }
    await responsePromise.catch(() => {});

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' && !!c?.querySelector('.blog-featured');
    }, { timeout: 15000 });

    const content = page.locator('#content');
    const searchInput = content.locator('.blog-search-input');
    const gridCards = content.locator('.blog-cards-grid .blog-card');
    const totalBefore = await gridCards.count();
    await expect(gridCards.first()).toBeVisible();

    await searchInput.fill('accessibility');
    await page.waitForTimeout(400);

    await searchInput.press('Escape');
    await page.waitForTimeout(100);
    await expect(searchInput).toHaveValue('');
    await expect(content.locator('.blog-search-no-results')).toBeHidden({ timeout: 5000 });
    await expect(gridCards).toHaveCount(totalBefore);
    await expect(gridCards.first()).toBeVisible();
  });

  test('Read Article from Engineering loads post in SPA', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.evaluate(() => {
        const panel = document.getElementById('mobile-nav-panel-blog');
        if (panel) {
          panel.classList.add('mobile-nav-group-panel-open');
          panel.setAttribute('aria-hidden', 'false');
        }
      });
      await page.locator('#mobile-nav-panel-blog').getByRole('link', { name: 'Engineering' }).click();
    } else {
      const blogButton = page.locator('#navbar-links').getByRole('button', { name: 'Blog' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Blog' })
      );
      await blogButton.hover();
      await page.locator('.dropdown-menu-blog').first().getByRole('link', { name: 'Engineering' }).click();
    }

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' && !!c?.querySelector('.blog-featured-cta');
    }, { timeout: 15000 });

    const readArticleLink = page.locator('#content .blog-featured-cta[data-url="html/pages/engineering/accessibility-is-not-just-a-feature.html"]');
    await expect(readArticleLink).toBeVisible({ timeout: 5000 });
    await readArticleLink.scrollIntoViewIfNeeded();
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('accessibility-is-not-just-a-feature.html') && res.status() === 200,
      { timeout: 15000 }
    );
    await readArticleLink.click();
    await responsePromise;

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return !!c?.querySelector('#post-body') || !!c?.querySelector('.post-content .post-title');
    }, { timeout: 10000 });

    await expect(page.locator('#content #post-body')).toBeVisible();
    await expect(page.locator('#content')).toContainText('Accessibility Is Not Just a Feature');
  });

  test('Post detail page shows banner, hero, and article body', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || '';
    const waitUntil = browserName === 'firefox' ? 'networkidle' : 'domcontentloaded';
    await page.goto('/', { waitUntil: waitUntil as 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.evaluate(() => {
        const panel = document.getElementById('mobile-nav-panel-blog');
        if (panel) {
          panel.classList.add('mobile-nav-group-panel-open');
          panel.setAttribute('aria-hidden', 'false');
        }
      });
      await page.locator('#mobile-nav-panel-blog').getByRole('link', { name: 'Engineering' }).click();
    } else {
      const blogButton = page.locator('#navbar-links').getByRole('button', { name: 'Blog' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Blog' })
      );
      await blogButton.hover();
      await page.locator('.dropdown-menu-blog').first().getByRole('link', { name: 'Engineering' }).click();
    }

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' && !!c?.querySelector('.blog-featured-cta');
    }, { timeout: 15000 });

    const readArticleLink = page.locator('#content .blog-featured-cta[data-url="html/pages/engineering/accessibility-is-not-just-a-feature.html"]');
    await expect(readArticleLink).toBeVisible({ timeout: 5000 });
    await readArticleLink.scrollIntoViewIfNeeded();
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('accessibility-is-not-just-a-feature.html') && res.status() === 200,
      { timeout: 15000 }
    );
    await readArticleLink.click();
    await responsePromise;

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return !!c?.querySelector('#post-body') || !!c?.querySelector('.post-content .post-title');
    }, { timeout: 10000 });

    const content = page.locator('#content');

    await expect(content.locator('.post-banner')).toBeVisible();
    await expect(content.locator('.post-banner-img')).toBeVisible();
    await expect(content.locator('.post-hero')).toBeVisible();
    await expect(content.locator('.post-hero')).toContainText('Accessibility Is Not Just a Feature');
    await expect(content.locator('.post-meta')).toBeVisible();
    await expect(content.locator('#post-body')).toBeVisible();
    await expect(content.locator('#post-body blockquote').first()).toBeVisible();
  });

  test('Read Article button has visible text in dark mode', async ({ page }, testInfo) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
    }, { timeout: 15000 });

    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    const isMobile = await page.evaluate(() => window.innerWidth <= 768);
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('engineering.html') && (res.status() === 200 || res.status() === 304),
      { timeout: 8000 }
    );
    if (isMobile) {
      await page.locator('#mobile-menu-toggle').click();
      await page.waitForSelector('#mobile-sidebar.active', { timeout: 5000 });
      await page.evaluate(() => {
        const panel = document.getElementById('mobile-nav-panel-blog');
        if (panel) {
          panel.classList.add('mobile-nav-group-panel-open');
          panel.setAttribute('aria-hidden', 'false');
        }
      });
      await page.locator('#mobile-nav-panel-blog').getByRole('link', { name: 'Engineering' }).click();
    } else {
      const blogButton = page.locator('#navbar-links').getByRole('button', { name: 'Blog' }).or(
        page.locator('#navbar-links').getByRole('link', { name: 'Blog' })
      );
      await blogButton.hover();
      await page.locator('.dropdown-menu-blog').first().getByRole('link', { name: 'Engineering' }).click();
    }
    await responsePromise.catch(() => { /* no response (e.g. cache); rely on DOM wait below */ });

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' && !!c?.querySelector('.blog-featured-cta');
    }, { timeout: 15000 });

    const readArticleLink = page.locator('#content').getByRole('link', { name: 'Read Article' });
    await expect(readArticleLink).toBeVisible();
    await expect(readArticleLink).toContainText('Read Article');
  });
});
