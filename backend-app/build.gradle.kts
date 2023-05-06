import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  id("org.springframework.boot") version "3.0.6"
  id("io.spring.dependency-management") version "1.1.0"
  kotlin("jvm") version "1.7.22"
  kotlin("plugin.spring") version "1.7.22"

  id("com.google.cloud.tools.jib") version "2.1.0"
  id("org.owasp.dependencycheck") version "8.2.1"
}

repositories {
  mavenCentral()
}

group = "altszama"
version = "1.0.0-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

val arrow_version = "0.11.0"

dependencies {
  // Spring Boot
  implementation("org.springframework.boot:spring-boot-starter-data-mongodb")
  implementation("org.springframework.boot:spring-boot-starter-security")
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-validation")
  developmentOnly("org.springframework.boot:spring-boot-devtools")

  // Web push notifications
  implementation("nl.martijndwars:web-push:5.1.1")
  implementation("org.bouncycastle:bcprov-jdk15on:1.69")

  // Jackson
  implementation("com.fasterxml.jackson.module:jackson-module-parameter-names")
  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation("com.fasterxml.jackson.datatype:jackson-datatype-jdk8")
  implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")

  // Google OAuth2
  implementation("com.google.apis:google-api-services-oauth2:v2-rev65-1.17.0-rc")
  implementation("com.google.api-client:google-api-client:2.0.0")

  // JJWT
  implementation("io.jsonwebtoken:jjwt-api:0.11.5")
  runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
  implementation("io.jsonwebtoken:jjwt-jackson:0.11.5")

  // Kotlin
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.4.2")

  // Arrow
  implementation("io.arrow-kt:arrow-core:$arrow_version")
  implementation("io.arrow-kt:arrow-syntax:$arrow_version")
  implementation("io.arrow-kt:arrow-fx:$arrow_version")

  // SpringDoc
  implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.1.0")

  // Test
  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("org.springframework.security:spring-security-test")
}

tasks.withType<KotlinCompile> {
  kotlinOptions {
    freeCompilerArgs = listOf("-Xjsr305=strict")
    jvmTarget = "17"
  }
}

tasks.withType<Test> {
  useJUnitPlatform()
}
