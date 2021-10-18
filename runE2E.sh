#!/usr/bin/env bash

# Exit script if you try to use an uninitialized variable.
set -o nounset

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail


export TARGET_PORT=8099
export DOCKER_TAG="latest-${CIRCLE_BRANCH}"

docker-compose -p TEST up -d

sleep 5

cd ./e2e

npx testcafe chrome:headless src/tests/ --speed=0.7

cd ../

docker-compose -p TEST down
