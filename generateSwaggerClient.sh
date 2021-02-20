java -jar swagger-codegen-cli.jar generate \
   -i http://localhost:8088/v3/api-docs/frontend \
   -l typescript-fetch \
   -o ./app/vue-app/src/frontend-client/
