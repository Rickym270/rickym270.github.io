# Personal Site (rickym270.github.io)
   ## Description
      This site will host notes, tutorials, and projects. It started as a Python teaching page and evolved into a personal site.
   ## Notes:
      - Added a hack (405.html) to enable single page apps

## Backend API (Spring Boot)
   The repo contains a minimal Java backend under `api/` to support dynamic features.

   Quick start
   - Run with Maven Wrapper:
     - From repo root:
       - cd api && ./mvnw -DskipTests spring-boot:run
   - Or with Docker (no local JDK/Maven needed):
     - From repo root:
       - cd api && docker run --rm -it -p 8080:8080 -v "$PWD":/app -w /app maven:3.9-eclipse-temurin-17 mvn -DskipTests spring-boot:run

   For full run/test instructions, see `docs/TESTING.md`.

   Endpoints
   - Production API: https://ricky-api-745807383723.us-east1.run.app
   - Local dev: http://localhost:8080
   
   - GET /api              → Health (UP, version, time)
   - GET /api/health       → Health (UP, version, time)
   - GET /api/meta         → Profile metadata (name, title, location, languages, links)
   - GET /api/projects     → Project list merged from GitHub API + `data/projects.json`
   - GET /api/stats        → Rollup stats (projects count, unique languages, lastUpdated)
   - GET /api/github/activity → Recent GitHub activity (type, repo, createdAt)
   - GET /api/home         → Simple home text
   - POST /api/contact     → Submit contact form (JSON body: name, email, subject, message)
   - GET /api/contact      → Admin-only, requires `X-API-Key`

   Error handling
   - All errors return JSON with keys: `error`, `message`, `time` (ISO‑8601)
   - Common statuses
     - 404 `not_found`: unknown route
     - 422 `validation_error`: invalid body/params
     - 400 `bad_request` / `bad_request_body`: malformed JSON or missing header/param
     - 401 `unauthorized`: incorrect/missing `X-API-Key` for admin endpoints
     - 405 `method_not_allowed`: wrong HTTP method
     - 415 `unsupported_media_type`: bad `Content-Type`

   Requirements
   - Java 17+
   - Maven Wrapper (preferred) or local Maven

   Run locally (Maven Wrapper)
   1. Ensure Java 17 is active in your shell
   2. From repo root:
      - cd api
      - ./mvnw -DskipTests spring-boot:run

   Run locally (Docker, no Maven install)
   - From the `api/` directory:
     - docker run --rm -it -p 8080:8080 -v "$PWD":/app -w /app maven:3.9-eclipse-temurin-17 mvn -DskipTests spring-boot:run

   Test the API
   - curl -s http://localhost:8080/api
   - curl -s http://localhost:8080/api/meta
   - curl -s http://localhost:8080/api/projects
   - curl -s http://localhost:8080/api/stats
   - curl -s http://localhost:8080/api/github/activity
   - curl -s -X POST http://localhost:8080/api/contact -H 'Content-Type: application/json' -d '{"name":"RMTest","email":"rmtest@testing.com","subject":"Test Subject","message":"Test!"}'
   - curl -s -H "X-API-Key: $ADMIN_API_KEY" http://localhost:8080/api/contact

   Quick error tests
   - 404: `curl -s -i http://localhost:8080/api/does-not-exist`
   - 422: `curl -s -i -X POST http://localhost:8080/api/contact -H 'Content-Type: application/json' -d '{"name":"","email":"bad","subject":"","message":""}'`
   - 400 malformed: `curl -s -i -X POST http://localhost:8080/api/contact -H 'Content-Type: application/json' -d '{ bad'`
   - 401: `curl -s -i http://localhost:8080/api/contact`
   - 405: `curl -s -i -X PUT http://localhost:8080/api/contact`
   - 415: `curl -s -i -X POST http://localhost:8080/api/contact -H 'Content-Type: text/plain' -d 'hello'`

   Notes on /api/projects
   Environment variables
   - `GH_TOKEN` (optional): increases GitHub API rate limits
   - `ADMIN_API_KEY` (required for GET /api/contact): admin secret for listing contact messages
   - The endpoint fetches public repos from GitHub for user `rickym270` and overlays any matching entries from `api/src/main/resources/data/projects.json` (by repo name).
   - If the GitHub request fails or is rate-limited, it falls back to the curated `projects.json` only.
   - Optional: set `GH_TOKEN` in the environment to raise GitHub API rate limits.

   Development notes
   - Main app: `com.rickym270.api.ApiApplication` (component scan set to `com.rickym270`)
   - Controllers live under `com.rickym270.controllers` with base path `/api`

## Frontend & Testing
   Requirements
   - Node.js 18.x (LTS recommended)
   - npm (comes with Node.js)

   Verify Node.js version:
   ```bash
   node -v  # should show v18.x.x
   npm -v
   ```

   Run Playwright tests:
   ```bash
   npm i
   npx playwright install --with-deps
   npm test
   ```

   Or use the npm scripts:
   - `npm test` - Run tests headless
   - `npm run test:ui` - Run with Playwright UI
   - `npm run test:headed` - Run in headed mode
   - `npm run test:debug` - Debug mode
