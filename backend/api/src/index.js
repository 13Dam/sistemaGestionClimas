import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "./utils/logger.js";
import config from "./config/index.js";
import { connectMongo } from "./db/mongo.js";
import readingsRouter from "./routes/readings.js";
import aggregatesRouter from "./routes/aggregates.js";
import seedRouter from "./routes/seed.js";
import { getWeather } from "./services/weatherService.js"; // tu import

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "200kb" }));

// Routers existentes
app.use("/api/readings", readingsRouter);
app.use("/api/aggregates", aggregatesRouter);
app.use("/api/seed", seedRouter);

// Tu router de weather
const weatherRouter = express.Router();
weatherRouter.get("/weather/:city", async (req, res) => {
  try {
    const weather = await getWeather(req.params.city);
    res.json(weather);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.use(weatherRouter);

app.use((err, req, res, next) => {
  logger.error("Unhandled error", { msg: err.message, stack: err.stack });
  res.status(500).json({ error: "internal_error" });
});

async function bootstrap() {
  await connectMongo(config.MONGO_URI);
  app.listen(config.PORT, () => {
    logger.info(`MS4 Readings escuchando en http://localhost:${config.PORT} [MODE=${config.MODE}]`);
  });
}

bootstrap().catch(err => {
  logger.error("Fallo al iniciar", err);
  process.exit(1);
});
