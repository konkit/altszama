#!/usr/bin/env bash

# Exit script if you try to use an uninitialized variable.
set -o nounset

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail

# Fill .env file if it doesn't exist
if [ ! -f ".env" ]; then
  echo "DATABASE_HOST=$DATABASE_HOST" >> .env
  echo "DATABASE_NAME=$DATABASE_NAME" >> .env
  echo "DATABASE_PORT=$DATABASE_PORT" >> .env
  echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> .env
  echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" >> .env
  echo "VAPID_PUBLIC_KEY=$VAPID_PUBLIC_KEY" >> .env
  echo "VAPID_PRIVATE_KEY=$VAPID_PRIVATE_KEY" >> .env
  echo "VAPID_SUBJECT=$VAPID_SUBJECT" >> .env
  echo "ORIGIN_URL=$ORIGIN_URL" >> .env
  echo "JWT_SIGNING_KEY=$JWT_SIGNING_KEY" >> .env
  echo "SENTRY_URL=$SENTRY_URL" >> .env
  echo "SERVER_PORT=$SERVER_PORT" >> .env
  echo "spring_profiles_active=$spring_profiles_active" >> .env
fi


export TARGET_PORT=8099
export DOCKER_TAG="latest-${CIRCLE_BRANCH}"

docker-compose -p TEST up -d

sleep 60

cd ./e2e

npm install
npm run testcafe:all -- chrome:headless --speed=0.7

cd ../

docker-compose -p TEST down
