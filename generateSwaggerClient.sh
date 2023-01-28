java -jar swagger-codegen-cli-3.0.35.jar generate \
   -i http://localhost:8088/api/swagger/frontend \
   -l typescript-angular \
   -o ./frontend-angular/src/frontend-client/
