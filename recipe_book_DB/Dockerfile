# Stage 1: Build (Maven + Java 21)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# Copy the pom.xml and source code
COPY . .
# Run the maven build to create the JAR file
RUN mvn clean package -DskipTests

# Stage 2: Run (Java 21 JRE)
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Maven puts the JAR in the 'target' folder. This copies it to the runner stage.
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]