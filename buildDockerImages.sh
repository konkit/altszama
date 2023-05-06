#!/usr/bin/env bash

# Exit script if you try to use an uninitialized variable.
set -o nounset

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail


PUSH_IMAGES=true
DEFAULT_TAG="latest-${CURRENT_BRANCH-master}"
TAG="${TAG:-$DEFAULT_TAG}"

cd ./vue-app || return 1
docker build -t "konkit/altszama-frontend:${TAG}" .
if [ $PUSH_IMAGES == true ]; then
  docker push "konkit/altszama-frontend:${TAG}"
fi
cd ../

cd ./frontend-angular || return 1
docker build -t "konkit/altszama-frontend:${TAG}-angular" .
if [ $PUSH_IMAGES == true ]; then
  docker push "konkit/altszama-frontend:${TAG}-angular"
fi
cd ../

cd ./reverse-proxy || return 1
docker build -t "konkit/altszama-reverse-proxy:${TAG}" .
if [ $PUSH_IMAGES == true ]; then
  docker push "konkit/altszama-reverse-proxy:${TAG}"
fi
cd ../

cd ./backend-app || return 1
./gradlew bootBuildImage --imageName="konkit/altszama-backend:${TAG}"
if [ $PUSH_IMAGES == true ]; then
  docker push "konkit/altszama-backend:${TAG}"
fi
cd ../

cd ./e2e || return 1
docker build -t "konkit/altszama-e2e:${TAG}" .
if [ $PUSH_IMAGES == true ]; then
  docker push "konkit/altszama-e2e:${TAG}"
fi
cd ../

