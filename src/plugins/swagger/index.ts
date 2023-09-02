import { SwaggerOptions } from "@fastify/swagger";
import { FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

const swaggerOpts: SwaggerOptions = {
  mode: "dynamic",
  swagger: {
    info: {
      title: "Fastify-API",
      description: "Fastify-API, basic api with necessary functionalities",
      version: "0.1.0",
    },
    consumes: ["application/json"],
    produces: ["application/json"],
    basePath: "/v1",
    securityDefinitions: {
      jwt: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
        description:
          "Access-Token granted by logging as a user. Can be used to call apis.",
      },
    },
    host: "localhost",
  },
  transform: jsonSchemaTransform,
};

const swaggerUiOpts: FastifySwaggerUiOptions = {
  routePrefix: "/docs",
  logo: {
    type: "",
    content: "",
  },
};

export { swaggerOpts, swaggerUiOpts };
