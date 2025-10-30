# Meta Endpoint Testing — /api/meta

## Overview
Provides profile metadata for the About section.

## Positive tests
```bash
curl -s http://localhost:8080/api/meta | jq
```
- Expect 200 and keys: `name`, `title`, `location`, `languages` (array), `github`, `portfolio`.
- Validate URLs for `github` and `portfolio` are well-formed.

## Negative tests
```bash
# Method not allowed
curl -s -i -X PUT http://localhost:8080/api/meta
```
- Expect 405 `method_not_allowed` JSON error.

## Performance tests
```bash
for i in {1..20}; do curl -s http://localhost:8080/api/meta > /dev/null; done
```
- Low latency, no errors.

## E2E tests
- Front-end About page consumes this endpoint and renders fields correctly.
