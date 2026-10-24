# --- Stage 1: Build the JAR ---
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src
# Build the application (skipping tests to save deployment time)
RUN mvn clean package -DskipTests

# --- Stage 2: Run the Application ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy the built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar
# Expose port 8080 (Render will override this dynamically)
EXPOSE 8080
# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]