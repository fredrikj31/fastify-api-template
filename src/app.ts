import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { config } from "./config";
import { healthcheck } from "./routes/healthcheck";
import { swaggerOpts, swaggerUiOpts } from "./plugins/swagger";
import { logger } from "./logger";
import { todos } from "./routes/todos";

export const build = () => {
  const app = Fastify({
    logger,
    disableRequestLogging: config.environment !== "local",
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app
    .register(cors, {
      origin: true,
    })
    .register(fastifySwagger, swaggerOpts)
    .register(fastifySwaggerUi, swaggerUiOpts)
    .register(healthcheck)
    .after(() => {
      app.register(todos, { prefix: "/v1/todos" });
    });

  return app;
};
