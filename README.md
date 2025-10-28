# Personal Site (rickym270.github.io)
   ## Description
      This site will host notes, tutorials, and projects. It started as a Python teaching page and evolved into a personal site.
   ## Notes:
      - Added a hack (405.html) to enable single page apps

## Backend API (Spring Boot)
   The repo contains a minimal Java backend under `api/` to support dynamic features.

   Endpoints
   - GET http://localhost:8080/api              → Health/status (UP, java, time)
   - GET http://localhost:8080/api/health       → Same as above
   - GET http://localhost:8080/api/meta         → Site metadata (name, tagline, links)
   - GET http://localhost:8080/api/projects     → Project list merged from GitHub API + `data/projects.json`
   - GET http://localhost:8080/api/home        → Simple home text

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
   - curl -s http://localhost:8080/api | jq
   - curl -s http://localhost:8080/api/meta | jq
   - curl -s http://localhost:8080/api/projects | jq

   Notes on /api/projects
   - The endpoint fetches public repos from GitHub for user `rickym270` and overlays any matching entries from `api/src/main/resources/data/projects.json` (by repo name).
   - If the GitHub request fails or is rate-limited, it falls back to the curated `projects.json` only.
   - Optional: set `GITHUB_TOKEN` in the environment to raise GitHub API rate limits.

   Development notes
   - Main app: `com.rickym270.api.ApiApplication` (component scan set to `com.rickym270`)
   - Controllers live under `com.rickym270.controllers` with base path `/api`
