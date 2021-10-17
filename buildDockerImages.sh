if [[ -n "$CIRCLE_BRANCH" ]]; then
  TAG="latest-${CIRCLE_BRANCH}"
else
  TAG="latest-master"
fi

cd ./vue-app || return 1
docker build -t konkit/altszama-frontend:${TAG} .
docker push konkit/altszama-frontend:${TAG} .
cd ../

cd ./reverse-proxy || return 1
docker build -t konkit/altszama-reverse-proxy:${TAG} .
docker push konkit/altszama-reverse-proxy:${TAG} .
cd ../

cd ./backend-app || return 1
./gradlew bootBuildImage --imageName=konkit/altszama-backend:${TAG} .
docker push konkit/altszama-backend:${TAG} .
cd ../

