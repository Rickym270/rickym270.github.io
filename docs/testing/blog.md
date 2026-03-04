# Blog Page Testing

## Overview

The blog has two listing pages (Engineering and Personal), reached from the Blog dropdown in the main nav. The Engineering page shows a Featured Post, a "Latest Insights" section with category pills, and a grid of blog post cards (one real article plus placeholders). The Personal page uses the same layout with "Coming Soon" placeholders throughout. Search and filter toolbar were removed and may be re-added later.

## Structure

### Engineering (`html/pages/engineering.html`)

- **Featured Post**: Hero section with real post title, short description, "Read Article" button, and metadata (date, read time). Links use SPA `inline-load` and `data-url="html/pages/engineering/post-1.html"`.
- **Latest Insights**: Section heading (h2), subtitle, and category pills (All Posts, Web Dev, Automation, DevOps, Productivity). No search bar in current implementation.
- **Blog cards grid**: One real card (post-1) with image, category, date, title, description, tags, and "Read more" link; two placeholder cards with "Coming Soon".

### Personal (`html/pages/lifestyle.html`)

- **Featured Post**: Same hero layout with "Coming Soon" for title and description (no CTA).
- **Latest Insights**: Same section and category pills (All Posts, Life, Travel, Hobbies).
- **Blog cards grid**: Three placeholder cards with "Coming Soon".

### Post detail page (article view)

When a post is opened (e.g. from Engineering "Read Article" or the first card’s "Read more" link), the same content as `html/pages/engineering/post-1.html` is loaded into `#content` via the SPA.

- **Structure**: Banner image at top (`.post-banner`, `.post-banner-img`), then `.post-hero` (`.post-meta` for date/category/read time and `.post-title`), then `#post-body` (article content: paragraphs, h2s, lists, blockquotes).
- **Styling**: Banner has shadow, max-height, and rounded corners; post meta uses secondary text color; blockquotes use accent left border, background, and padding; body has spacing for h2s, paragraphs, and lists. Both `html/css/blog.css` and `html/css/modern.css` apply (post-1.html links both).
- **Entry points**: Reached via SPA from Engineering "Read Article" or from the first card’s "Read more" link.

### Styling

- **Blog CSS** (`html/css/blog.css`): Featured hero, Latest Insights, category pills, and card grid styles. Dark mode: CTA button and "Read more" link use explicit colors (e.g. white for CTA, lighter blue for "Read more") so text stays visible.

## Navigation

- **Blog dropdown** (desktop and mobile): Opens Engineering and Personal links. Active state shows when on either blog page.
- **From Engineering**: "Read Article" (Featured) or the first card’s "Read more" link loads the full post (`html/pages/engineering/post-1.html`) into `#content` via the SPA (no full page reload).

## E2E Test Coverage

**`tests/blog.spec.ts`** covers:

- Engineering page loads via Blog dropdown (desktop and mobile).
- Personal page loads via Blog dropdown (desktop and mobile).
- Engineering page structure: Featured Post (real title, "Read Article" link), Latest Insights (h2, category pills), at least one real card and one placeholder card; no search bar present.
- Personal page structure: Featured and Latest Insights present; three placeholder cards with "Coming Soon".
- Navigation: Clicking "Read Article" from Engineering loads the post body in `#content` (SPA).
- Post detail structure: banner, hero (meta + title), article body, and at least one blockquote visible when post is loaded in SPA.
- Dark mode: "Read Article" button has visible text when theme is dark.

**Other specs that touch blog:**

- **`tests/translation.spec.ts`**: Navigates to Engineering, clicks post link, and asserts translated post title and body in Spanish.
- **`tests/navbar.spec.ts`**: Asserts Blog dropdown and Engineering/Personal links are visible.

## Running Blog Tests

```bash
# Run all blog tests
npx playwright test tests/blog.spec.ts

# Run in a specific browser
npx playwright test tests/blog.spec.ts --project=chromium
npx playwright test tests/blog.spec.ts --project=chromium-iphone
npx playwright test tests/blog.spec.ts --project=firefox

# Run with UI (interactive)
npx playwright test tests/blog.spec.ts --ui
```
