import express from "express";
import dotenv from "dotenv";
import config from "./config/index.js";
import { router as ingestRouter } from "./routes/ingest.js";
import { router as healthRouter } from "./routes/health.js";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "200kb" }));

// Rutas
app.use("/ingest", ingestRouter);
app.use("/health", healthRouter);

// Error handler (final)
app.use((err, req, res, next) => {
  logger.error("Unhandled error", { msg: err.message, stack: err.stack });
  res.status(500).json({ error: "internal_error" });
});

app.listen(config.PORT, () => {
  logger.info(`Webhook REST Client escuchando en http://localhost:${config.PORT} [MODE=${config.MODE}]`);
});
