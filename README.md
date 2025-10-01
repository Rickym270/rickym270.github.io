# Personal Site (rickym270.github.io)
   ## Description
      This site will host notes, tutorials, and projects. It started as a Python teaching page and evolved into a personal site.
   ## Notes:
      - Added a hack (405.html) to enable single page apps

## Backend API (Spring Boot)
   The repo contains a minimal Java backend under `api/` to support dynamic features.

   Endpoints
   - GET http://localhost:8080/api → API OK
   - GET http://localhost:8080/api/hello → Hello

   Requirements
   - Java 17+
   - EITHER local Maven OR Docker

   Run locally (Maven)
   1. Ensure Java 17 is active in your shell
   2. From repo root:
      - cd api
      - mvn -DskipTests spring-boot:run

   Run locally (Docker, no Maven install)
   - From the api/ directory:
     - docker run --rm -it -p 8080:8080 -v "$PWD":/app -w /app maven:3.9-eclipse-temurin-17 mvn -DskipTests spring-boot:run

   Test the API
   - curl -i http://localhost:8080/api
   - curl -i http://localhost:8080/api/hello

   Development notes
   - Main app: com.rickym270.api.ApiApplication (component scan set to com.rickym270)
   - Controllers under com.rickym270.controllers are discovered automatically
