# Contact Endpoint Testing — /api/contact

## Overview
Handles contact form submissions (POST) and lists stored messages for admin review (GET).

- **POST /api/contact**: Submit a new message (public, with validation)
- **GET /api/contact**: List all stored messages (admin-only, requires `X-API-Key` header)

**Important**: Messages are stored in-memory and will be cleared on server restart.

---

## Positive Tests

### Submit a valid message (POST)
```bash
curl -s -X POST http://localhost:8080/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"RMTest","email":"rmtest@testing.com","message":"Test!"}'
```

**Expected**:
- Status: `201 Created`
- Response body includes:
  - `id`: UUID string
  - `name`: "RMTest"
  - `email`: "rmtest@testing.com"
  - `message`: "Test!"
  - `receivedAt`: ISO-8601 timestamp

### List messages as admin (GET)

**Step 1**: Start server with `ADMIN_API_KEY` set:
```bash
cd api
ADMIN_API_KEY="your-admin-key" ./mvnw -DskipTests spring-boot:run
```

**Step 2**: Submit at least one message (see POST example above).

**Step 3**: Retrieve all messages (use environment variable, never hardcode keys):
```bash
curl -s -H "X-API-Key: ${ADMIN_API_KEY}" http://localhost:8080/api/contact
```

**Expected**:
- Status: `200 OK`
- Response body: Array of message objects with `id`, `name`, `email`, `message`, `receivedAt`.
- If no messages submitted yet, returns empty array `[]`.

---

## Negative Tests

### 422 Validation Error (invalid body)
```bash
curl -s -i -X POST http://localhost:8080/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"","email":"bad","message":""}'
```

**Expected**:
- Status: `422 Unprocessable Entity`
- Response:
  ```json
  {
    "time": "2025-10-30T...",
    "error": "validation_error",
    "message": "name: must not be blank, email: must be a well-formed email address, message: must not be blank"
  }
  ```

### 400 Bad Request (malformed JSON)
```bash
curl -s -i -X POST http://localhost:8080/api/contact \
  -H 'Content-Type: application/json' \
  -d '{ bad json'
```

**Expected**:
- Status: `400 Bad Request`
- Response:
  ```json
  {
    "time": "2025-10-30T...",
    "error": "bad_request_body",
    "message": "..."
  }
  ```

### 415 Unsupported Media Type
```bash
curl -s -i -X POST http://localhost:8080/api/contact \
  -H 'Content-Type: text/plain' \
  -d 'hello'
```

**Expected**:
- Status: `415 Unsupported Media Type`
- Response:
  ```json
  {
    "time": "2025-10-30T...",
    "error": "unsupported_media_type",
    "message": "Content type 'text/plain' not supported..."
  }
  ```

### 401 Unauthorized (GET without API key)
```bash
curl -s -i http://localhost:8080/api/contact
```

**Expected**:
- Status: `401 Unauthorized`
- Response:
  ```json
  {
    "time": "2025-10-30T...",
    "error": "unauthorized",
    "message": "Invalid or missing API key"
  }
  ```

### 401 Unauthorized (GET with wrong API key)
```bash
curl -s -i -H "X-API-Key: wrong-key" http://localhost:8080/api/contact
```

**Expected**:
- Status: `401 Unauthorized`
- Response:
  ```json
  {
    "time": "2025-10-30T...",
    "error": "unauthorized",
    "message": "Invalid or missing API key"
  }
  ```

### 405 Method Not Allowed
```bash
curl -s -i -X PUT http://localhost:8080/api/contact
```

**Expected**:
- Status: `405 Method Not Allowed`
- Response:
  ```json
  {
    "time": "2025-10-30T...",
    "error": "method_not_allowed",
    "message": "Method 'PUT' not supported for this endpoint..."
  }
  ```

---

## Edge Cases

### Maximum field lengths
```bash
# Name: max 100 chars
curl -s -i -X POST http://localhost:8080/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"'$(printf 'A%.0s' {1..101})'","email":"test@example.com","message":"Hi"}'

# Message: max 2000 chars
curl -s -i -X POST http://localhost:8080/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@example.com","message":"'$(printf 'A%.0s' {1..2001})'"}'
```

**Expected**: `422 Unprocessable Entity` with validation error for size constraints.

### Empty array on fresh server
```bash
# Start fresh server, GET immediately (no POST yet)
# Use environment variable, never hardcode keys
curl -s -H "X-API-Key: ${ADMIN_API_KEY}" http://localhost:8080/api/contact
```

**Expected**: `200 OK` with empty array `[]`.

---

## Performance Tests

### Burst submit (20 messages)
```bash
for i in {1..20}; do
  curl -s -X POST http://localhost:8080/api/contact \
    -H 'Content-Type: application/json' \
    -d '{"name":"Load'$i'","email":"load'$i'@example.com","message":"Performance test"}' > /dev/null
done
```

**Expected**: All requests succeed with `201 Created`, no errors or timeouts.

### Retrieve large list
After submitting 20+ messages, retrieve all (use environment variable, never hardcode keys):
```bash
curl -s -H "X-API-Key: ${ADMIN_API_KEY}" http://localhost:8080/api/contact
```

**Expected**: `200 OK` with array of all 20+ messages, stable latency.

---

## E2E Tests

1. **Front-end form submission**:
   - User fills out contact form on portfolio site
   - Submit triggers POST to `/api/contact`
   - Verify 201 response and success message displayed

2. **Admin dashboard**:
   - Admin navigates to messages view
   - App calls GET `/api/contact` with stored API key
   - Verify all submitted messages render correctly with timestamp

3. **Error handling**:
   - Submit invalid form (empty fields)
   - Verify front-end displays validation errors from 422 response

---

## Troubleshooting

### GET returns 401 even with correct key

**Cause**: Server not started with `ADMIN_API_KEY` environment variable.

**Fix**:
```bash
# Restart server with key set
cd api
ADMIN_API_KEY="your-admin-key" ./mvnw -DskipTests spring-boot:run
```

Alternatively, pass as JVM system property:
```bash
./mvnw -DskipTests -DADMIN_API_KEY="your-admin-key" spring-boot:run
```

### GET returns empty array

**Cause**: No messages submitted yet, or server was restarted (messages cleared).

**Fix**: POST at least one message before calling GET.

### Whitespace issues with API key

**Cause**: Extra spaces in key or header.

**Fix**: The controller now trims both values, but ensure no newlines or tabs:
```bash
# Bad (trailing space, and never hardcode keys - use environment variable)
curl -H "X-API-Key: ${ADMIN_API_KEY} " http://localhost:8080/api/contact

# Good
curl -H "X-API-Key: ${ADMIN_API_KEY}" http://localhost:8080/api/contact
```

---

## Automated Tests

See `tests/contact.spec.ts` for Playwright API tests covering:
- Happy path POST
- Validation errors (422)
- Malformed JSON (400)
- Unsupported media type (415)
- Unauthorized GET (401)
- Authorized GET (200)

Run tests:
```bash
# From repo root
npx playwright test tests/contact.spec.ts
```

