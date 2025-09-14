import { Router } from "express";
import Reading from "../models/reading.js";
import config from "../config/index.js";
import { validatePayload } from "../utils/validator.js";
import logger from "../utils/logger.js";

const router = Router();

// Guard simple (opcional): validar API_KEY si está configurada
router.use((req, res, next) => {
  if (config.API_KEY) {
    const auth = req.header("Authorization") || "";
    if (!auth.startsWith("Bearer ") || auth.split(" ")[1] !== config.API_KEY) {
      return res.status(401).json({ error: "unauthorized" });
    }
  }
  next();
});

// POST /api/readings  -> insertar una lectura
router.post("/", async (req, res, next) => {
  try {
    const payload = req.body;
    const { valid, errors } = validatePayload(payload, config.ALLOWED_CITIES);
    if (!valid) return res.status(400).json({ errors });

    const doc = new Reading({
      city: payload.city,
      temperature: Number(payload.temperature),
      unit: payload.unit || "°C",
      timestamp: payload.timestamp,
      source: payload.source || "ms3"
    });
    const saved = await doc.save();
    logger.info("Reading guardado", { id: saved._id });
    return res.status(201).json({ ok: true, id: saved._id });
  } catch (err) {
    return next(err);
  }
});

// GET /api/readings?city=Shanghai&from=ts&to=ts&limit=100
router.get("/", async (req, res, next) => {
  try {
    const { city, from, to, limit = 100 } = req.query;
    const q = {};
    if (city) q.city = city;
    if (from || to) q.timestamp = {};
    if (from) q.timestamp.$gte = Number(from);
    if (to) q.timestamp.$lte = Number(to);

    const docs = await Reading.find(q).sort({ timestamp: 1 });
    return res.json({ count: docs.length, data: docs });
  } catch (err) {
    next(err);
  }
});

export default router;
