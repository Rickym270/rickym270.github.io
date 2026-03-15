# Projects Endpoint Testing — /api/projects

## Overview
Returns projects merged from GitHub public repos and curated `data/projects.json`. Falls back to curated only if GitHub fails/rate-limits.

## Frontend loading (Projects page) — cache-first and background refresh
The Projects page uses **cache-first loading** so content appears quickly when the API is slow or sleeping (e.g. Render free tier):

1. **Initial display**: Data is loaded from **static file** `/data/web_data/projects.json` first, then **localStorage** (1h TTL) if the static file is missing. If either has data, the UI renders immediately and a note is shown: *"Showing cached projects; some data may be outdated."* (translation key `projects.fallbackNote`).
2. **No cache**: If neither static file nor localStorage has data, the page falls back to **API** → **localStorage** → **static file** (same as previous behavior) and waits for a response before rendering.
3. **Background refresh**: When the initial display came from cache, the app fetches from **API** in the background. If the API response **matches** the displayed data (by slug, name, summary), nothing changes. If it **differs**, the UI is updated silently: cache and localStorage are updated, the list is re-rendered, and the fallback note is removed.

This avoids long "Please wait" when the API is cold; users see cached projects immediately and get a silent update when the API responds with newer data.

## Positive tests
```bash
curl -s http://localhost:8080/api/projects
```
- Expect 200 JSON array.
- Each item has: `slug`, `name`, `summary`, `repo`, optional `tech`, `featured` (default false).
- Featured sorted first, then by name.

## Negative tests
```bash
# Force missing/invalid token still OK (should fallback or continue)
unset GH_TOKEN
curl -s -i http://localhost:8080/api/projects
```
- Expect 200 and non-empty list (curated fallback is acceptable if GitHub rate-limits).

## Validation/merge behavior
- If the same repo exists in curated and GitHub, curated fields (e.g., summary, featured) should override GitHub when present.
- Curated-only projects not on GitHub should still appear in the final list.

## Performance tests
```bash
# Quick burst
for i in {1..20}; do curl -s http://localhost:8080/api/projects > /dev/null; done
```
- Expect no errors; latency stable.

## E2E tests
- Front-end projects view renders list correctly using this endpoint.
- Traces/screenshots in CI (Playwright) should link to this endpoint without flakiness.
- **Cache-first**: When the API is slow or returns 503, the page shows projects from the static file quickly (`tests/projects.spec.ts`: "shows projects from cache first when API is slow").
- **Background update**: When initial data is from cache and the API later returns different data, the UI updates silently and the fallback note is removed (`tests/projects.spec.ts`: "silently updates projects when background API returns different data").

## Security tests
- CORS is limited to `https://rickym270.github.io` on other controllers; verify front-end origin access works as expected.
- No secrets are exposed in payload.
