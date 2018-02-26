# AltSzama - when Google Sheet is not enough

App written in Spring Boot + Vue 2 + MongoDB + Google Login. Its purpose is to help order food for bigger group of people.

### How to run dev environment ?

1. Put those values as environment variables (perferably in Intellij "Edit Configuration" for Application.kt and "runVueDevServer" kotlin task):
    - gcmSenderId - API number for receiving push notifications
    - gcmServerKey - API key for sending Push Notifications
    - googleClientId - Google's ClientID value
    - googleClientSecret - Google's Client Secret value
    - BACKEND_URL - Backend (so Kotlin app) URL. Default http://localhost:8080

2. Run the project from IDE 
    - backend app in Kotlin via running Application.kt 
    - frontend app in Vue via running "runVueDevServer" Gradle task


### How to run production environment ?

1. For production  environment, the gradle task "vueProd" first builds the frontend 
app and then copies it to output folder so the Kotlin app is build with complete resources

2. Put those values as environment variables:
- gcmSenderId - API number for receiving push notifications
- gcmServerKey - API key for sending Push Notifications
- spring.data.mongodb.database - MongoDB database name
- googleClientId - Google's ClientID value
- googleClientSecret - Google's Client Secret value
- sentryURL - URL for sentry (saas for reporting client-side errors)

3. "build" Gradle task should already depend on vueProd task.
