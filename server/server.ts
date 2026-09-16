import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { apiRouter } from "./routes/api";
import { errorHandler } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";

export function createServer() {
  const app = express();
  app.use(cors({ origin: env.frontendOrigin }));
  app.use(express.json({ limit: "1mb" }));
  app.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok", service: "personax-api" } }));
  app.use("/api", apiRouter);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

if (process.env.NODE_ENV !== "test") {
  createServer().listen(env.port, () => console.log(`PersonaX API listening on http://localhost:${env.port}`));
}
