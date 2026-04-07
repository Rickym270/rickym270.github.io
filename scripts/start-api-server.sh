#!/bin/bash

# Fail fast if no real JDK (macOS ships /usr/bin/java stub that only prints an error).
if ! java -version >/dev/null 2>&1; then
  echo "Error: Java JDK is not installed or not on PATH." >&2
  echo "This API targets Java 17 (see api/pom.xml). On macOS with Homebrew, for example:" >&2
  echo "  brew install openjdk@17" >&2
  echo "Then add the JDK bin directory to PATH (brew prints the exact path after install), e.g.:" >&2
  echo "  export PATH=\"/opt/homebrew/opt/openjdk@17/bin:\$PATH\"   # Apple Silicon" >&2
  echo "  export PATH=\"/usr/local/opt/openjdk@17/bin:\$PATH\"      # Intel" >&2
  exit 1
fi

# Check if API server is already running and healthy (for reuseExistingServer: true)
if lsof -ti:8080 > /dev/null 2>&1; then
  echo "API server already running on port 8080, checking health..."
  # Wait for health endpoint to be ready
  for i in {1..10}; do
    if curl -s http://127.0.0.1:8080/api/health > /dev/null 2>&1; then
      echo "API server is ready and healthy, reusing existing instance"
      # Keep script running so Playwright doesn't kill the server
      while true; do sleep 60; done
      exit 0
    fi
    sleep 1
  done
  echo "API server port is in use but health endpoint not responding, killing and restarting..."
  lsof -ti:8080 | xargs kill -9 2>/dev/null || true
  sleep 2
fi

# Build and start the API server
cd api
./mvnw clean package spring-boot:repackage -DskipTests
java -Dserver.port=8080 -jar target/api-0.0.1-SNAPSHOT.jar

