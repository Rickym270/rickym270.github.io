# Health Endpoint Testing — /api, /api/health

## Overview
Returns API heartbeat with status, version, and ISO timestamp.

## Positive tests
```bash
# Either endpoint should return 200 with expected keys
curl -s http://localhost:8080/api
curl -s http://localhost:8080/api/health
```
- Assert keys: `status == "UP"`, `version` non-empty, `time` ISO-8601.
- Response Content-Type: `application/json`.

## Negative tests
```bash
# Wrong method
curl -s -i -X PUT http://localhost:8080/api/health
```
- Expect 405 `method_not_allowed` JSON error.

## Performance tests
- Warm-up 1–2 calls, then:
```bash
# Simple quick run (10 reqs)
for i in {1..10}; do curl -s http://localhost:8080/api > /dev/null; done

# ApacheBench example (if installed)
ab -n 200 -c 20 http://localhost:8080/api/
```
- Latency should be low; no errors.

## E2E tests
- Start API; front-end (if applicable) should show an online indicator.
- Verify deployment environment returns the same schema.
