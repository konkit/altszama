java -jar swagger-codegen-cli-3.0.35.jar generate \
   -i http://localhost:8088/api/swagger/frontend \
   -l typescript-fetch \
   -o ./vue-app/src/frontend-client/
