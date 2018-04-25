import com.moowork.gradle.node.npm.NpmInstallTask
import com.moowork.gradle.node.npm.NpmTask
import com.moowork.gradle.node.task.NodeTask
import org.gradle.api.tasks.bundling.Jar

allprojects {
  group = "altszama"
  version = "1.0.0"

  repositories {
    mavenCentral()
    maven { setUrl("https://repo.spring.io/milestone") }
    mavenLocal()
    jcenter()
    maven { url = uri("http://repo.spring.io/plugins-release") }
    maven { url = uri("https://plugins.gradle.org/m2/") }
  }
}

plugins {
  java
}

buildscript {
  repositories {
    mavenCentral()
    jcenter()
    maven { url = uri("http://repo.spring.io/plugins-release") }
    maven { url = uri("https://plugins.gradle.org/m2/") }
  }
  dependencies {
    classpath("org.springframework.boot:spring-boot-gradle-plugin:1.5.6.RELEASE")
    classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.2.40")
    classpath("com.moowork.gradle:gradle-node-plugin:1.2.0")
  }
}

apply {
  plugin("org.springframework.boot")
  plugin("java")
  plugin("idea")
  plugin("eclipse")
  plugin("kotlin")
  plugin("com.moowork.node")
}

tasks.withType<Jar> {
  group = "altszama"
  version = "1.0-SNAPSHOT"
  baseName = "altszama"
}

configure<JavaPluginConvention> {
  setSourceCompatibility(1.8)
  setTargetCompatibility(1.8)
}

dependencies {

  compile("org.springframework.boot", "spring-boot-starter-data-mongodb")
  compile("org.springframework.boot", "spring-boot-starter-web")
  compile("org.springframework.boot", "spring-boot-devtools")
  //compile("org.springframework.boot", "spring-test")

  // Security
  compile("org.springframework.boot", "spring-boot-starter-security")
  compile("org.springframework.security", "spring-security-config")
  compile("org.springframework.security", "spring-security-data")
  compile("org.springframework.security", "spring-security-web")

  // Web push notifications
  compile("de.bytefish.fcmjava", "fcmjava-core", "2.1")
  compile("de.bytefish.fcmjava", "fcmjava-client", "2.1")

  // For cryptographic operations
  compile("org.bouncycastle", "bcprov-jdk15on", "1.54")
  compile("nl.martijndwars", "web-push", "3.0.0")

  compile("com.fasterxml.jackson.module:jackson-module-parameter-names")
  compile("com.fasterxml.jackson.module:jackson-module-kotlin")
  compile("com.fasterxml.jackson.datatype:jackson-datatype-jdk8")
  compile("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")

  compile("com.google.apis:google-api-services-oauth2:v2-rev65-1.17.0-rc")
  compile("com.google.api-client:google-api-client:1.23.0")

  // JJWT
  compile("io.jsonwebtoken:jjwt:0.9.0")

  // Kotlin
  compile(kotlin("stdlib", "1.1.51"))
  compile("org.funktionale:funktionale-all:1.2")

  testCompile("org.springframework.boot:spring-boot-starter-test")
}

tasks {

  val vueNpmInstall = task("vueNpmInstall", type=NpmTask::class) {
    setWorkingDir(file("vue-app/"))
    setArgs(listOf("install"))
  }

  val vueRunBuild = task("vueRunBuild", type=NodeTask::class) {
    dependsOn(vueNpmInstall)
    setWorkingDir(file("vue-app/"))
    setScript(file("vue-app/build/build.js"))
  }

  val copyVueToBuild = task("copyVueToBuild", type=Copy::class) {
    dependsOn(vueRunBuild)
    from("vue-app/dist")
    into("build/resources/main/public")
  }

  val copyVueToOut = task("copyVueToOut", type=Copy::class) {
    dependsOn(vueRunBuild)
    from("vue-app/dist")
    into("out/production/resources/public/")
  }

  val vueProd = task("vueProd") {
    setGroup("altszama")
    dependsOn(copyVueToBuild, copyVueToOut)
  }

  "processResources" {
    dependsOn(vueProd)
  }

  val runVueDevServer = task("runVueDevServer", type=NodeTask::class) {
    dependsOn(vueNpmInstall)
    setGroup("altszama")
    setWorkingDir("vue-app/")
    setScript(file("vue-app/build/dev-server.js"))
  }
}
