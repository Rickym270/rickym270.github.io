# Build stage: compile the Spring Boot JAR
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn
COPY src src

RUN ./mvnw -DskipTests package -q

# Run stage: minimal JRE to run the JAR
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/api-0.0.1-SNAPSHOT.jar .

EXPOSE 8080

# PORT is set by Render; application.properties uses server.port=${PORT:8080}
CMD ["java", "-jar", "api-0.0.1-SNAPSHOT.jar"]
