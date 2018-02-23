## How to run dev environment ?

1. For dev environment:
    - the backend part is run as Kotlin App 
    - the frontend part is run via webpack dev server (for hot-reload and faster feedback)

2. Put those values as environment variables (perferably in Intellij "Edit Configuration"):
    - gcmSenderId - API number for receiving push notifications
    - gcmServerKey - API key for sending Push Notifications
    - googleClientId - Google's ClientID value
    - googleClientSecret - Google's Client Secret value
    - BACKEND_URL - Backend (so Kotlin app) URL. Default http://localhost:8080
    - sentryURL - URL for sentry (saas for reporting client-side errors)

3. Run the project from IDE - backend part as Kotlin App, part by "runVueDevServer" Gradle task 


## How to run production environment ?

1. For production  environment, the gradle task "vueProd" first builds the frontend 
app and then copies it to output folder so the Kotlin app is build with complete resources

2. Put those values as environment variables:
- gcmSenderId - API number for receiving push notifications
- gcmServerKey - API key for sending Push Notifications
- spring.data.mongodb.database - MongoDB database name
- googleClientId - Google's ClientID value
- googleClientSecret - Google's Client Secret value
- sentryURL - URL for sentry (saas for reporting client-side errors)

3. Running "build" project should already depend on vueProd task.
