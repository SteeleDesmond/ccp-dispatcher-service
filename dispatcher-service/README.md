# CCP Dispatcher Service

## API Docs

This application provides a local Swagger UI page for API docs at http://localhost:3005

### Contributing

Install the latest [Node.js](https://nodejs.org/en/download/) 12+ LTS version.
Download **Redis** and **MongoDB** locally, or use an existing instance. Set the values in `package.json` under config

Run Redis and MongoDB as background processes:
`mongo &`

`redis-server /usr/local/etc/redis.conf &`

Once the Node toolchain has been installed, you can download the project dependencies with:

```bash
npm install
npm run build
npm run start
```

HTTPS Local Cert testing: Generate a cert into root directory `openssl req -nodes -new -x509 -keyout server.key -out server.cert`

Generate an auth token to use the API with IBM SSO `https://openid-userinfo.apps.labdev-ccp.ocp.csplab.local/login`

Import the Postman collection for testing under `/docs` (The collection at the repo root is for CI/CD testing)

Starting the app using nodemon:
`npm run-script start:dev`

With pino-pretty:
`nodemon ./src/index.ts | ./node_modules/.bin/pino-pretty -c -l`

In debug mode:
`LOG_LEVEL=debug nodemon ./src/index.ts | ./node_modules/.bin/pino-pretty`

View the Swagger API at localhost.


#### Packages

- Built with [TypeScript](https://www.typescriptlang.org/)
- REST services using `typescript-rest` decorators
- Swagger documentation using `typescript-rest-swagger`
- Dependency injection using `typescript-ioc` decorators
- Logging using `bunyan`
- TDD environment with [Jest](https://jestjs.io/)
- Pact testing [Pact](https://docs.pact.io/)
- Jenkins DevOps pipeline that support OpenShift or IKS deployment

#### License

This application is licensed under the Apache License, Version 2. Separate third-party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1](https://developercertificate.org/) and the [Apache License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache License FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)



