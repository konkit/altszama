#!/usr/bin/env bash

# Exit script if you try to use an uninitialized variable.
set -o nounset

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail



TAG="latest-${CIRCLE_BRANCH}"

cd ./vue-app || return 1
docker build -t konkit/altszama-frontend:${TAG} .
docker push konkit/altszama-frontend:${TAG}
cd ../

cd ./reverse-proxy || return 1
docker build -t konkit/altszama-reverse-proxy:${TAG} .
docker push konkit/altszama-reverse-proxy:${TAG}
cd ../

cd ./backend-app || return 1
./gradlew bootBuildImage --imageName=konkit/altszama-backend:${TAG}
docker push konkit/altszama-backend:${TAG}
cd ../

