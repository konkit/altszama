# AltSzama

Order food with your colleauges and keep track of orders and payments!

https://altszama.club

App written in Spring Boot + Vue.js + MongoDB + Google Login.

## Environemnt variables used in the backend app

| Environement variable  | Description                                            | Required |
|------------------------|--------------------------------------------------------|----------|
| DATABASE_NAME          | name of the MongoDB database                           | true     |
| DATABASE_HOST          | hostname of the MongoDB database                       | true     |
| DATABASE_PORT          | port on which MongoDB database is running              | true     |
| GOOGLE_CLIENT_ID       | Client ID for Google Login                             | true     |
| GOOGLE_CLIENT_SECRET   | Client Secret for Google Login                         | true     |
| VAPID_PUBLIC_KEY       | VAPID public key for Web Push Notifications            | true     |
| VAPID_PRIVATE_KEY      | VAPID private key for Web Push Notifications           | true     |
| VAPID_SUBJECT          | VAPID subject key,  `mailto:youremailaddress@mail.com` | true     |
| ORIGIN_URL             | URL to backend                                         | true     |
| SENTRY_URL             | URL to Sentry API for catching front-end errors        | true     |
| JWT_SIGNING_KEY        | used for signing JWT tokens                            | true     |
| spring_profiles_active | set to  `development` when running locally             | true     |