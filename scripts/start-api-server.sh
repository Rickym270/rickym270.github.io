#!/bin/bash
# Kill any existing API server on port 8080
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
sleep 2

# Build and start the API server
cd api
./mvnw clean package spring-boot:repackage -DskipTests
java -Dserver.port=8080 -jar target/api-0.0.1-SNAPSHOT.jar

