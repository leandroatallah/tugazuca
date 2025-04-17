export const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Portuguese Dictionary API",
      version: "1.0.0",
      description: "API for comparing Brazilian and European Portuguese words",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["**/*.routes.ts"],
};
