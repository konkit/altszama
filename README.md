# AltSzama

Order food with your colleauges and keep track of orders and payments!

https://altszama.club

App written in Spring Boot + Vue.js + MongoDB + Google Login.

## Environemnt variables used in backend app
DATABASE_NAME - name of the MongoDB database

DATABASE_HOST - hostname of the MongoDB database

DATABASE_PORT - port on which MongoDB database is running

GOOGLE_CLIENT_ID - Client ID for Google Login

GOOGLE_CLIENT_SECRET - Client Secret for Google Login

VAPID_PUBLIC_KEY - VAPID public key for Web Push Notifications

VAPID_PRIVATE_KEY - VAPID private key for Web Push Notifications

VAPID_SUBJECT - VAPID subject key, `mailto:youremailaddress@mail.com`

ORIGIN_URL - URL to backend

JWT_SIGNING_KEY - used for signing JWT tokens

spring_profiles_active - set to `development` when running locally

## Environemnt variables used in frontend app

VUE_APP_GOOGLE_CLIENT_ID - the same as GOOGLE_CLIENT_ID

VUE_APP_SENTRY_URL - Sentry API URL

VUE_APP_VAPID_PUBLIC_KEY - the same as VAPID_PUBLIC_KEY