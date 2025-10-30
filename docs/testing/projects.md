# Projects Endpoint Testing — /api/projects

## Overview
Returns projects merged from GitHub public repos and curated `data/projects.json`. Falls back to curated only if GitHub fails/rate-limits.

## Positive tests
```bash
curl -s http://localhost:8080/api/projects | jq
```
- Expect 200 JSON array.
- Each item has: `slug`, `name`, `summary`, `repo`, optional `tech`, `featured` (default false).
- Featured sorted first, then by name.

## Negative tests
```bash
# Force missing/invalid token still OK (should fallback or continue)
unset GITHUB_TOKEN
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

## Security tests
- CORS is limited to `https://rickym270.github.io` on other controllers; verify front-end origin access works as expected.
- No secrets are exposed in payload.
