cd vue-app
docker build -t altszama-frontend:latest .
cd ../reverse-proxy
docker build -t altszama-reverse-proxy:latest .
cd ../backend-app
./gradlew bootBuildImage
cd ../

