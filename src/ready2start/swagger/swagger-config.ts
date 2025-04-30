const swaggerCfg = {
  openapi: '3.0.1',
  info: {
    title: 'balancefit api',
    version: '0.0.1',
    description: '',
  },
  servers: [],
  security: [],
  paths: {},
  tags: [],
  externalDocs: [],
  components: {
    schemas: {},
    securitySchemes: {
      // # arbitrary name for the security scheme
      bearerAuth: {
        type: 'oauth2',
        flows: {
          password: {
            tokenUrl: '/v1/auth/signin', //v1/auth/token
            // scopes: [], // optional
          },
        },
      },
      /*
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      */
    },
  },
};

export default swaggerCfg;
