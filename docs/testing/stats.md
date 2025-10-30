# Stats Endpoint Testing — /api/stats

## Overview
Returns rollup stats for curated projects and unique languages.

## Positive tests
```bash
curl -s http://localhost:8080/api/stats
```
- Expect 200 and keys: `projects` (int), `languages` (array), `lastUpdated` (ISO string).
- `projects` should equal the number of items in curated `data/projects.json` (not GitHub merged).
- `languages` must be unique and non-empty when present.

## Negative tests
```bash
# Method not allowed
curl -s -i -X POST http://localhost:8080/api/stats
```
- Expect 405 `method_not_allowed` JSON error.

## Performance tests
```bash
for i in {1..20}; do curl -s http://localhost:8080/api/stats > /dev/null; done
```
- Expect stable latency; no errors.

## E2E tests
- UI should display project count and language list using this endpoint.
