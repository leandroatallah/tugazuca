export const swaggerOptions = {
  swaggerDefinition: {
    myapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
    },
  },
  apis: ["**/*.routes.ts"],
};
