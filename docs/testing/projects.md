# Projects Endpoint Testing — /api/projects

## Overview
Returns projects merged from GitHub public repos and curated `data/projects.json`. Falls back to curated only if GitHub fails/rate-limits.

## Frontend loading (Projects page) — API first, then tab session cache
The Projects page loads the list **from the API first** (same origin as configured in `api-config.js` / `api.js`). **One successful response per browser tab** is then reused for later SPA navigations to Projects without calling `/api/projects` again:

1. **In-memory (`window.projectsCache`)**: After the first successful load in the SPA, revisiting Projects uses this buffer immediately (no network).
2. **`sessionStorage` key `portfolio_projects_api_session_v1`**: After a successful API response, the JSON is stored here (with `fromApi: true`). If the user navigates away and `projects.js` re-injects (clearing only in-memory state), `fetchProjectsWithFallback()` reads this snapshot **before** calling the API again — still **one successful `/api/projects` fetch per tab** for the live list until the tab is closed or storage is cleared.
3. **`window.projectsCacheFromApi`**: Distinguishes in-memory rows that came from the API vs static/localStorage fallback so the “cached / outdated” banner is only shown for non-API sources.
4. **Fallbacks** (only when the API fails): **localStorage** (1h TTL, key `portfolio_projects_cache`) then **static** `/data/web_data/projects.json`. In that case **at most one** note may appear: *"Showing cached projects; some data may be outdated."* (`projects.fallbackNote`). Duplicate note elements are stripped before insert.

`index.html` prefetches projects on home load so the first Projects visit often reuses an in-flight or completed fetch. See `tests/projects.spec.ts` (*Projects SPA revisit does not call API again*, *Projects list prefers API over static file*).

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
- **API first, then static**: When the API is slow then errors, the page eventually shows projects from the static file (`tests/projects.spec.ts`: "Projects waits for API then uses static fallback…").
- **API beats static**: When both static JSON and API return data, the UI shows the API list (`tests/projects.spec.ts`: "Projects list prefers API over static file…").
- **One `/api/projects` per tab session**: After a successful API load, a second SPA visit does not call the API again (`tests/projects.spec.ts`: "Projects SPA revisit does not call API again…").

## Security tests
- CORS is limited to `https://rickym270.github.io` on other controllers; verify front-end origin access works as expected.
- No secrets are exposed in payload.
