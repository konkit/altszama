java -jar swagger-codegen-cli.jar generate \
   -i http://localhost:8088/api/swagger/frontend \
   -l typescript-fetch \
   -o ./vue-app/src/frontend-client/
