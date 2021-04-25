cd ../
./buildDockerImages.sh
TARGET_PORT=8099 docker-compose -p TEST up -d
cd ./e2e
TARGET_PORT=8099 npx testcafe chrome src/tests/ --debug-on-fail
cd ../
TARGET_PORT=8099 docker-compose -p TEST down