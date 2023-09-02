import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const healthcheck: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get(
    "/healthcheck",
    {
      schema: {
        hide: true,
        tags: ["healthcheck"],
        response: {
          "200": z.object({ ok: z.boolean() }),
        },
      },
    },
    async () => ({
      ok: true,
    })
  );
};
