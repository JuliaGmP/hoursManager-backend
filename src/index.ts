import { HoursManagerBackendApplication } from './application';
import { ApplicationConfig } from '@loopback/core';
import { OpenApiSpec } from '@loopback/openapi-v3';

export { HoursManagerBackendApplication };

export async function main(options: ApplicationConfig = {}) {
  const spec: OpenApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Authorization',
      version: '0.1',
    },
    paths: {},
    security: [
      {
        accessToken: [],
      },
    ],
    components: {
      securitySchemes: {
        accessToken: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
  };



  const app = new HoursManagerBackendApplication(options);

  app.api(spec);

  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
