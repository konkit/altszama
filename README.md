# AltSzama
<img src="https://circleci.com/gh/konkit/altszama.svg?style=shield"></img>

https://altszama.club

Order food with your colleauges and keep track of orders and payments!

App written in Spring Boot + Vue.js + MongoDB + Google Login.

## Environemnt variables used in the backend app

| Environement variable  | Description                                            |
|------------------------|--------------------------------------------------------|
| DATABASE_NAME          | name of the MongoDB database                           |
| DATABASE_HOST          | hostname of the MongoDB database                       |
| DATABASE_PORT          | port on which MongoDB database is running              |
| GOOGLE_CLIENT_ID       | Client ID for Google Login                             |
| GOOGLE_CLIENT_SECRET   | Client Secret for Google Login                         |
| VAPID_PUBLIC_KEY       | VAPID public key for Web Push Notifications            |
| VAPID_PRIVATE_KEY      | VAPID private key for Web Push Notifications           |
| VAPID_SUBJECT          | VAPID subject key,  `mailto:youremailaddress@mail.com` |
| ORIGIN_URL             | URL to backend                                         |
| SENTRY_URL             | URL to Sentry API for catching front-end errors        |
| JWT_SIGNING_KEY        | used for signing JWT tokens                            |
| spring_profiles_active | set to  `development` when running locally             |

