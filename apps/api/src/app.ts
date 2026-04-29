import express from "express";
import path from "path";
import fs from "fs";
import { securityMiddleware } from "./middleware/security";
import { errorHandler } from "./middleware/error";
import healthRoute from "./routes/health.route";
import imageRoute from "./routes/image.route";
import { env } from "./config/env";
import { logger } from "./config/logger";
import pdfRoute from "./routes/pdf.route";

const app = express();

// ensure tmp dir exists (for future disk storage)
if (!fs.existsSync(env.TMP_DIR)) fs.mkdirSync(env.TMP_DIR, { recursive: true });

// core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(...securityMiddleware);

// routes
app.use("/health", healthRoute);
app.use("/api/image", imageRoute);
app.use("/api/pdf", pdfRoute);

// static (if you need to expose generated files later)
// app.use("/downloads", express.static(path.resolve(env.TMP_DIR)));

// 404
app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

// error handler
app.use(errorHandler);

// basic startup log from the app layer
logger.debug({ TMP_DIR: env.TMP_DIR, MAX_UPLOAD_MB: env.MAX_UPLOAD_MB }, "App configured");

export default app;
