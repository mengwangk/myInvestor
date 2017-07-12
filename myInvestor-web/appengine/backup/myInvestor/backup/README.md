# myInvestor Google App Engine App

## Setup

To add Gradle support in Eclipse

https://stackoverflow.com/questions/17907927/update-my-gradle-dependencies-in-eclipse

### Google Cloud EndPoint

https://github.com/GoogleCloudPlatform/endpoints-framework-gradle-plugin
https://cloud.google.com/endpoints/docs/frameworks/java/get-started-frameworks-java

https://myinvestor-dev.appspot.com/_ah/api/explorer
http://localhost:8080/_ah/api/explorer


set ENDPOINTS_SERVICE_NAME="echo-api.endpoints.myinvestor-stg.cloud.goog"

 curl -H "Content-Type: application/json" -X POST -d '{"message":"hello world"}' https://myinvestor-stg.appspot.com/_ah/api/echo/v1/echo

curl -H "Content-Type: application/json" -X POST -d '{"message":"hello world"}' http://localhost:8080/_ah/api/echo/v1/echo

(Invoke-WebRequest -Method POST -Body '{"message": "hello world"}' `
-Headers @{"content-type"="application/json"} -URI `
"https://myinvestor-dev.appspot.com/_ah/api/echo/v1/echo").Content

     
# gcloud service-management deploy openapi.json
     
Waiting for async operation operations/serviceConfigs.echo-api.endpoints.myinvestor-dev.cloud.goog:d9a00c8c-d8e6-4400-8cfd-2c22671014dc to complete...

Operation finished successfully. The following command can describe the Operation details:

 gcloud service-management operations describe operations/serviceConfigs.echo-api.endpoints.myinvestor-dev.cloud.goog:d9a00c8c-d8e6-4400-8cfd-2c22671014dc

WARNING: openapi.json: Operation 'post' in path '/echo/v1/echo': Operation does not require an API key; callers may invoke the method without specifying an associated API-consuming project. To enable API key all the SecurityRequirement Objects (https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#security-requirement-object) inside security definition must reference at least one SecurityDefinition of type : 'apiKey'.

WARNING: openapi.json: Operation 'post' in path '/echo/v1/echo/{n}': Operation does not require an API key; callers may invoke the method without specifying an associated API-consuming project. To enable API key all the SecurityRequirement Objects (https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#security-requirement-object) inside security definition must reference at least one SecurityDefinition of type : 'apiKey'.

WARNING: openapi.json: Operation 'get' in path '/echo/v1/email': Operation does not require an API key; callers may invoke the method without specifying an associated API-consuming project. To enable API key all the SecurityRequirement Objects (https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#security-requirement-object) inside security definition must reference at least one SecurityDefinition of type : 'apiKey'.


WARNING: openapi.json: Operation 'get' in path '/echo/v1/firebase_user': Operation does not require an API key; callers may invoke the method without specifying an associated API-consuming project. To enable API key all the SecurityRequirement Objects (https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#security-requirement-object) inside security definition must reference at least one SecurityDefinition of type : 'apiKey'.


Waiting for async operation operations/rollouts.echo-api.endpoints.myinvestor-dev.cloud.goog:2017-07-11r2 to complete...
Operation finished successfully. The following command can describe the Operation details:
 gcloud service-management operations describe operations/rollouts.echo-api.endpoints.myinvestor-dev.cloud.goog:2017-07-11r2

Service Configuration [2017-07-11r2] uploaded for service [echo-api.endpoints.myinvestor-dev.cloud.goog]

To manage your API, go to: https://console.cloud.google.com/endpoints/api/echo-api.endpoints.myinvestor-dev.cloud.goog/overview?project=myinvestor-dev

     