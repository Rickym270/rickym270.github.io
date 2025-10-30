# Home Endpoint Testing — /api/home

## Overview
Returns a simple text payload "Home" for basic checks.

## Positive tests
```bash
curl -s -i http://localhost:8080/api/home
```
- Expect 200 and response body: `Home`.
- Content-Type may be `text/plain`.

## Negative tests
```bash
# Method not allowed
curl -s -i -X POST http://localhost:8080/api/home
```
- Expect 405 `method_not_allowed` JSON error.

## Performance tests
```bash
for i in {1..50}; do curl -s http://localhost:8080/api/home > /dev/null; done
```
- No errors; minimal latency.

## E2E tests
- Front-end route that references this endpoint (if any) should render fallback content without delay.
