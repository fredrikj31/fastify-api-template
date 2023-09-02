import { build } from "../app";
import { config } from "../config";

// Entry-point when running locally
const app = build();
app.listen({ port: config.api.port, host: "0.0.0.0" }, (err: Error | null) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});

process.on("SIGINT", () => {
  app.log.warn(`SIGINT signal detected, terminating service`);
  app.close();
});

process.on("SIGTERM", () => {
  app.log.warn(`SIGTERM signal detected, terminating service`);
  app.close();
});
