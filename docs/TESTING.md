# API Run and Test Guide

This repo includes a minimal Spring Boot API under `api/` that powers dynamic features on the site.

Quick start
```bash
# From repo root
cd api
./mvnw -DskipTests spring-boot:run
# Or via Docker (no local JDK/Maven)
cd api && docker run --rm -it -p 8080:8080 -v "$PWD":/app -w /app maven:3.9-eclipse-temurin-17 mvn -DskipTests spring-boot:run
```

## Prerequisites
- Java 17+
- Maven Wrapper is included; local Maven is optional
- Port `8080` available locally

If you don't have Java 17 installed, use the Docker method below.

## Run (Maven Wrapper)
```bash
cd api
./mvnw -DskipTests spring-boot:run
```

Verify Java:
```bash
./mvnw -v   # should show Java 17.x
```

## Run (Docker, no local JDK)
```bash
cd api
docker run --rm -it -p 8080:8080 \
  -e GITHUB_TOKEN="$GITHUB_TOKEN" \
  -v "$PWD":/app -w /app \
  maven:3.9-eclipse-temurin-17 \
  mvn -DskipTests spring-boot:run
```

## Endpoints
- Health
```bash
curl -s http://localhost:8080/api
curl -s http://localhost:8080/api/health
```

- Metadata
```bash
curl -s http://localhost:8080/api/meta
```

- Projects (GitHub + curated merge)
```bash
curl -s http://localhost:8080/api/projects
```

- Stats
```bash
curl -s http://localhost:8080/api/stats
```

- GitHub recent activity
```bash
curl -s http://localhost:8080/api/github/activity
```

- Contact (submit message)
```bash
# Submit a contact message
curl -s -X POST http://localhost:8080/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Alex","email":"alex@example.com","message":"Loved your portfolio!"}' | jq
  -d '{"name":"RMTest","email":"rmtest@testing.com","message":"Test!"}'
```

- Contact (view messages - admin only)
```bash
# First, ensure server was started with ADMIN_API_KEY set:
# ADMIN_API_KEY="my-secret-key" ./mvnw -DskipTests spring-boot:run

# Then list all stored messages
curl -s -H "X-API-Key: my-secret-key" http://localhost:8080/api/contact
```

**Note**: Contact messages are stored in-memory and will be cleared on server restart. You must POST at least one message before the GET endpoint returns data.

- Home
```bash
curl -s http://localhost:8080/api/home
```

## Projects endpoint behavior
- Fetches public repositories for user `rickym270` from GitHub.
- Overlays curated fields from `api/src/main/resources/data/projects.json` by repo name.
- Sorts featured first, then by name.
- On any GitHub error/rate limit, falls back to curated JSON only.

Optional: to raise GitHub API limits
```bash
export GITHUB_TOKEN=ghp_yourToken
```

## Testing the Contact Endpoint

### Submit a message (POST)
```bash
curl -s -X POST http://localhost:8080/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"RMTest","email":"rmtest@testing.com","message":"Test!"}'
```

Expected: `201 Created` with the saved message including `id` and `receivedAt`.

### View messages as admin (GET)

**Important**: The server must be started with `ADMIN_API_KEY` set as an environment variable:

```bash
cd api
ADMIN_API_KEY="my-secret-key" ./mvnw -DskipTests spring-boot:run
```

Then retrieve all messages:
```bash
curl -s -H "X-API-Key: my-secret-key" http://localhost:8080/api/contact
```

Expected: `200 OK` with an array of all stored messages.

**Notes**:
- Messages are stored in-memory and reset on server restart
- You must POST at least one message before GET returns any data
- Empty list `[]` means no messages have been submitted yet

## Error responses
- All errors return JSON with keys: `error`, `message`, `time` (ISO‑8601)
- Common statuses:
  - 404 `not_found`: unknown route
  - 422 `validation_error`: invalid body/params
  - 400 `bad_request` / `bad_request_body`: malformed JSON or missing header/param
  - 401 `unauthorized`: incorrect/missing `X-API-Key`
  - 405 `method_not_allowed`: wrong HTTP method
  - 415 `unsupported_media_type`: bad `Content-Type`

### Quick error tests
```bash
# 404 not found
curl -s -i http://localhost:8080/api/does-not-exist

# 422 validation (invalid body)
curl -s -i -X POST http://localhost:8080/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"","email":"bad","message":""}'

# 400 malformed JSON
curl -s -i -X POST http://localhost:8080/api/contact \
  -H 'Content-Type: application/json' -d '{ bad'

# 401 unauthorized (no API key)
curl -s -i http://localhost:8080/api/contact

# 405 method not allowed
curl -s -i -X PUT http://localhost:8080/api/contact

# 415 unsupported media type
curl -s -i -X POST http://localhost:8080/api/contact \
  -H 'Content-Type: text/plain' -d 'hello'
```

## Troubleshooting
- Error about `StringConcatFactory` or class version:
  - Your environment is using Java 8. Switch to Java 17 or use Docker.
- IDE build path issues (IntelliJ/VS Code):
  - Set Project SDK/JDK to 17 and reimport Maven (`api/pom.xml`).
- Port already in use:
  - Stop the other service or run with `-Dserver.port=8081`.
