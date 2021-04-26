# cerberus-service
Cerberus frontend service for cerberus-api

## Requirements
* npm 6.9.0
* node v8.10.0

## Index
* [Getting started](#getting-started)
* [Native development](#native-development)
* [Development with docker](#development-with-docker)
*  [Tests in native development](#tests-in-native-development)
* [Linter in native development](#linter-in-native-development)
* [E2E tests in native development](#e2e-tests-in-native-development)

## Getting started

**1. Clone this repo**

### Native development
**2. Install dependencies**
```sh
$ npm install
```
**3. Add environment variables (you don't need to use `export` on OSX)**
```sh
$ export KEYCLOAK_AUTH_URL=https://your.sso.com/auth
$ export KEYCLOAK_CLIENT_ID=your-client-id
$ export KEYCLOAK_REALM=realm
$ export FORM_API_URL=https://form-api.example.com/
$ export REFDATA_API_URL=https://refdata-api.example.com/
$ export CERBERUS_API_URL=https://cerberus-api.example.com/
```
**4. Build development bundle** *(optional)*
```sh
$ npm run build:dev
```
**5. Start the application** *(optional)*
```sh
$ npm start
```

### Development with docker
**2. Build the application Docker container**
```sh
docker build -t cerberus-service .
```
**3. Run the resulting Docker container**
```sh
docker run --name cerberus-service -p 8080:8080 \
  --env KEYCLOAK_AUTH_URL=https://your.sso.com/auth \
  --env KEYCLOAK_CLIENT_ID=your-client-id \
  --env KEYCLOAK_REALM=realm \
  --env FORM_API_URL=https://form-api.example.com \
  --env REFDATA_API_URL=https://refdata-api.example.com \
  --env CERBERUS_API_URL=https://cerberus-api.example.com \
  cerberus-service
```

## Tests in native development

Setup your environment as described in [Native development](#native-development)

**3. Running jest tests**
```sh
npm test
```

## Linter in native development

Setup your environment as described in [Native development](#native-development)

**3. Running linter**
```sh
npm run lint -- <directory>
```

## E2E tests in native development

Set up your environment as described in [Native development](#native-development)

run script ./scripts/env-setup.sh to generate users credentials

There are two ways to run cypress tests, using the cypress test runner or running cypress tests using the command line.

By default, tests run against local environment.

**NOTE:** You will need, the [cerberus-service](https://github.com/UKHomeOffice/cerberus-service) application, to be running before triggering Cypress.

create a file called cypress.env.json on a root folder and include the following key-value pair when running the tests locally,
(These values would be automatically fetched from secret manager and would be set when tests running inside drone server / kube)

```json5
{
   "auth_base_url": "xxxx",
   "auth_realm": "xxx",
   "auth_client_id": "xxx",
   "cerberusServiceUrl": "xxx",
}
```

#### Running cypress test runner

Running all tests
```sh
npm run cypress:runner
```

Running all tests using environment settings from a configuration file
```sh
npm run cypress:runner -- --env configFile=dev
```
Once TestRunner launched, click on the interested spec inside folder cypress/integration/cerberus

#### Running cypress tests using the command line

Running all tests on local Environment, (It executes tests headless mode on Electron Browser)
```sh
npm run cypress:test:local
```

Running all tests on Development Environment, (It executes tests headless mode on Electron Browser)
```sh
npm run cypress:test:dev
```

Running a specific test
```sh
npm run cypress:test:local -- --spec cypress/integration/cerberus/tasks.spec.js
```

Running specific test with chrome browser
```sh
npm run cypress:test:local -- --browser chrome --spec cypress/integration/cerberus/task-management.spec.js
```
Running All tests and generating mochawesome html report with screenshots
```sh
npm run cypress:test:report -- -b chrome -c ${CERBERUS_WORKFLOW_SERVICE_URL} -e dev
```

Running specific test and generating mochawesome html report with screenshots
```sh
npm run cypress:test:report -- -b chrome -s cypress/integration/cerberus/login.spec.js
```

Running all tests and generating mochawesome html report with screenshots using script
export CERBERUS_WORKFLOW_SERVICE_URL=xxxxx
```sh
./scripts/run_tests.sh
```