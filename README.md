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
| JWT_SIGNING_KEY        | used for signing JWT tokens                            | true     |
| spring_profiles_active | set to  `development` when running locally             | true     |


## Environemnt variables used in the frontend app

They have to start with `VUE_APP_` prefix to be visible in development configuration
when passed via `.env` file.

| Environement variable    | Description                  | Required           |
|--------------------------|------------------------------|--------------------|
| VUE_APP_GOOGLE_CLIENT_ID | the same as GOOGLE_CLIENT_ID | true               |
| VUE_APP_SENTRY_URL       | Sentry API URL               | only in production |
| VUE_APP_VAPID_PUBLIC_KEY | the same as VAPID_PUBLIC_KEY | true               |

