import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';

const DEBUG_LOG = path.join(process.cwd(), '.cursor', 'debug-7ea7bf.log');
function debugLog(payload: { message: string; data?: Record<string, unknown>; hypothesisId?: string }) {
  const line = JSON.stringify({ sessionId: '7ea7bf', timestamp: Date.now(), ...payload }) + '\n';
  try { fs.appendFileSync(DEBUG_LOG, line); } catch { /* no-op */ }
}

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
    await expect(content.locator('.blog-featured')).toContainText('How Living With MS Changed');
    await expect(content.getByRole('link', { name: 'Read Article' })).toBeVisible();

    // Latest Insights
    await expect(content.locator('h2').filter({ hasText: 'Latest Insights' })).toBeVisible();
    await expect(content.locator('.blog-category-pills')).toBeVisible();
    await expect(content.locator('.blog-category-pill.active')).toContainText('All Posts');

    // Cards: at least one real card with post link, at least one placeholder
    await expect(content.locator('.blog-card:not(.placeholder) a[data-url="html/pages/engineering/post-1.html"]').first()).toBeVisible();
    await expect(content.locator('.blog-card.placeholder').filter({ hasText: 'Coming Soon' }).first()).toBeVisible();

    // No search bar (removed)
    await expect(content.locator('.blog-search-wrap')).toHaveCount(0);
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

    const placeholderCards = content.locator('.blog-card.placeholder');
    await expect(placeholderCards).toHaveCount(3);
    await expect(content.locator('.blog-card').filter({ hasText: 'Coming Soon' }).first()).toBeVisible();
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

    const readArticleLink = page.locator('#content .blog-featured-cta[data-url="html/pages/engineering/post-1.html"]');
    await expect(readArticleLink).toBeVisible({ timeout: 5000 });
    await readArticleLink.scrollIntoViewIfNeeded();
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('post-1.html') && res.status() === 200,
      { timeout: 15000 }
    );
    await readArticleLink.click();
    await responsePromise;

    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return !!c?.querySelector('#post-body') || !!c?.querySelector('.post-content .post-title');
    }, { timeout: 10000 });

    await expect(page.locator('#content #post-body')).toBeVisible();
    await expect(page.locator('#content')).toContainText('How Living With MS Changed');
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

    const readArticleLink = page.locator('#content .blog-featured-cta[data-url="html/pages/engineering/post-1.html"]');
    await expect(readArticleLink).toBeVisible({ timeout: 5000 });
    await readArticleLink.scrollIntoViewIfNeeded();
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('post-1.html') && res.status() === 200,
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
    await expect(content.locator('.post-hero')).toContainText('How Living With MS Changed');
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

    // #region agent log
    debugLog({
      message: 'before wait for engineering content',
      hypothesisId: 'H1',
      data: { project: testInfo.project.name, isMobile },
    });
    // #endregion
    await page.waitForFunction(() => {
      const c = document.querySelector('#content');
      return c?.getAttribute('data-content-loaded') === 'true' && !!c?.querySelector('.blog-featured-cta');
    }, { timeout: 15000 });

    const readArticleLink = page.locator('#content').getByRole('link', { name: 'Read Article' });
    await expect(readArticleLink).toBeVisible();
    await expect(readArticleLink).toContainText('Read Article');
  });
});
