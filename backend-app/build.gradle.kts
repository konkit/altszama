plugins {
  id("org.springframework.boot") version "3.4.3"
  id("io.spring.dependency-management") version "1.1.0"
  kotlin("jvm") version "2.1.10"
  kotlin("plugin.spring") version "1.7.22"

  id("com.google.cloud.tools.jib") version "2.1.0"
  id("org.owasp.dependencycheck") version "8.2.1"
}

repositories {
  mavenCentral()
}

group = "altszama"
version = "1.0.0-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_21

dependencies {
  // Spring Boot
  implementation("org.springframework.boot:spring-boot-starter-data-mongodb:3.4.3")
  implementation("org.springframework.boot:spring-boot-starter-security:3.4.3")
  implementation("org.springframework.boot:spring-boot-starter-web:3.4.3")
  implementation("org.springframework.boot:spring-boot-starter-validation:3.3.4")
  implementation("org.springframework.boot:spring-boot-starter-actuator:3.3.4")
  developmentOnly("org.springframework.boot:spring-boot-devtools:3.3.4")

  // Web push notifications
  implementation("nl.martijndwars:web-push:5.1.1")
  implementation("org.bouncycastle:bcprov-jdk18on:1.78")

  // Jackson
  implementation("com.fasterxml.jackson.module:jackson-module-parameter-names:2.17.2")
  implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.18.0")
  implementation("com.fasterxml.jackson.datatype:jackson-datatype-jdk8:2.17.2")
  implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.18.0")

  // Google OAuth2
  implementation("com.google.apis:google-api-services-oauth2:v2-rev65-1.17.0-rc")
  implementation("com.google.api-client:google-api-client:2.7.0")

  // JJWT
  implementation("io.jsonwebtoken:jjwt-api:0.12.3")
  runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.6")
  implementation("io.jsonwebtoken:jjwt-jackson:0.12.5")

  // Kotlin
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")

  // Arrow
  implementation("io.arrow-kt:arrow-core:1.2.4")

  // SpringDoc
  implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.3.0")

  // Metrics
  implementation("io.micrometer:micrometer-registry-prometheus:1.13.5")


  // Test
  testImplementation("org.springframework.boot:spring-boot-starter-test:3.3.3")
  testImplementation("org.springframework.security:spring-security-test:6.3.3")
}

kotlin {
  jvmToolchain(21)
}

//tasks.withType<KotlinCompile> {
//  kotlinOptions {
//    freeCompilerArgs = listOf("-Xjsr305=strict")
//    jvmTarget = "21"
//  }
//}

tasks.withType<Test> {
  useJUnitPlatform()
}
