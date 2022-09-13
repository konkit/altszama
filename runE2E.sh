#!/usr/bin/env bash

# Exit script if you try to use an uninitialized variable.
set -o nounset

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail

# Fill .env file if it doesn't exist
if [ ! -f ".envtest" ]; then
  echo ".envtest file not found"
  exit 1
fi

export TARGET_PORT=18099
export DOCKER_TAG="latest-${CURRENT_BRANCH-master}"

docker-compose -p teste2e --env-file=".envtest" up -d

function cleanup {
  docker-compose -p teste2e down
}
trap cleanup EXIT

sleep 30

docker run \
   -e "TARGET_HOST=reverse-proxy" \
   -e "TARGET_PORT=80" \
   --network=teste2e_default  \
   -it "konkit/altszama-e2e:$DOCKER_TAG" 'chromium:headless --speed=0.7' /app/src/tests
