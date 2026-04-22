# Stage 1: Build using Maven and Java 24
FROM maven:3-eclipse-temurin-24 AS build
WORKDIR /app
COPY . .
# Builds your JAR using Maven and your Java 24 project settings
RUN mvn clean package -DskipTests

# Stage 2: Run using Java 24 Runtime (JRE)
FROM eclipse-temurin:24-jre
WORKDIR /app
# Copies the generated JAR from the build stage to the run stage
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]