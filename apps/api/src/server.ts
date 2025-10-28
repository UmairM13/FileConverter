import "dotenv/config";
import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

const server = app.listen(env.PORT, () => {
  logger.info(`API listening on http://localhost:${env.PORT}`);
});

process.on("SIGINT", () => {
  logger.info("Shutting down...");
  server.close(() => process.exit(0));
});
