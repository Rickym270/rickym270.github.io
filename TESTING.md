# API Run and Test Guide

This repo includes a minimal Spring Boot API under `api/` that powers dynamic features on the site.

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
curl -s http://localhost:8080/api | jq
curl -s http://localhost:8080/api/health | jq
```

- Metadata
```bash
curl -s http://localhost:8080/api/meta | jq
```

- Projects (GitHub + curated merge)
```bash
curl -s http://localhost:8080/api/projects | jq
```

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

## Troubleshooting
- Error about `StringConcatFactory` or class version:
  - Your environment is using Java 8. Switch to Java 17 or use Docker.
- IDE build path issues (IntelliJ/VS Code):
  - Set Project SDK/JDK to 17 and reimport Maven (`api/pom.xml`).
- Port already in use:
  - Stop the other service or run with `-Dserver.port=8081`.

