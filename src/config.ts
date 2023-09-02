import z from "zod";
import "dotenv/config";

const envVarsSchema = z.object({
  ENVIRONMENT: z.enum(["local", "development", "production"]),
  PORT: z.coerce.number().default(3000),
});

const envVars = envVarsSchema.safeParse(process.env);
if (!envVars.success) {
  // eslint-disable-next-line no-console
  console.error("There is an error with your environment variables.");
  throw envVars.error;
}

export const config = {
  environment: envVars.data.ENVIRONMENT,
  api: {
    port: envVars.data.PORT,
  },
};
