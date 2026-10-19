plugins {
  id("org.springframework.boot") version "4.1.1"
  id("io.spring.dependency-management") version "1.1.7"
  kotlin("jvm") version "2.4.21"
  kotlin("plugin.spring") version "2.4.21"

  id("com.google.cloud.tools.jib") version "3.4.4"
  id("org.owasp.dependencycheck") version "8.2.1"
}

repositories {
  mavenCentral()
}

group = "altszama"
version = "1.0.0-SNAPSHOT"

// Security fixes newer than what Spring Boot 4.1.1 ships with (versions managed by its BOM)
extra["tomcat.version"] = "11.0.27"
extra["jackson-bom.version"] = "3.1.8"
extra["jackson-2-bom.version"] = "2.21.8"
extra["commons-lang3.version"] = "3.21.0"

dependencies {
  // Spring Boot
  implementation("org.springframework.boot:spring-boot-starter-data-mongodb")
  implementation("org.springframework.boot:spring-boot-starter-security")
  implementation("org.springframework.boot:spring-boot-starter-webmvc")
  implementation("org.springframework.boot:spring-boot-starter-validation")
  implementation("org.springframework.boot:spring-boot-starter-actuator")
  developmentOnly("org.springframework.boot:spring-boot-devtools")

  // Web push notifications
  implementation("nl.martijndwars:web-push:5.1.2")
  implementation("org.bouncycastle:bcprov-jdk18on:1.86")

  // Jackson
  implementation("tools.jackson.module:jackson-module-kotlin")

  // Google OAuth2
  implementation("com.google.apis:google-api-services-oauth2:v2-rev65-1.17.0-rc")
  implementation("com.google.api-client:google-api-client:2.7.2")

  // JJWT
  implementation("io.jsonwebtoken:jjwt-api:0.12.7")
  runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.7")
  implementation("io.jsonwebtoken:jjwt-jackson:0.12.7")

  // Kotlin
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")

  // Arrow
  implementation("io.arrow-kt:arrow-core:1.2.4")

  // SpringDoc
  implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:3.1.1")
  // SpringDoc still documents models with Jackson 2, and needs its Kotlin module to mark non-null fields as required
  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

  // Metrics
  implementation("io.micrometer:micrometer-registry-prometheus")


  // Test
  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
  testImplementation("org.springframework.boot:spring-boot-starter-security-test")

  constraints {
    // web-push 5.1.2 (the latest release) depends on versions with known vulnerabilities
    implementation("org.asynchttpclient:async-http-client:2.16.1") {
      because("fixes credential leaks and replay to other hosts in 2.12.x")
    }
    implementation("org.bitbucket.b_c:jose4j:0.9.7") {
      because("fixes JWE denial of service and weak algorithm issues in 0.7.x")
    }
  }
}

kotlin {
  jvmToolchain(25)
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
