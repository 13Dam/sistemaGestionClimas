import { Router } from "express";
import Reading from "../models/reading.js";

const router = Router();

/*
POST /api/seed
body: { days: 1|7, cities: ["Shanghai","Berlin"], freqMinutes: 30 }
*/
router.post("/", async (req, res, next) => {
  try {
    const { days = 1, cities = ["Shanghai","Berlin","Rio de Janeiro"], freqMinutes = 30 } = req.body;
    const now = Date.now();
    const msStep = freqMinutes * 60 * 1000;
    const total = Math.floor((days * 24 * 60) / freqMinutes);
    const docs = [];
    for (const city of cities) {
      for (let i = 0; i < total; i++) {
        const ts = now - (i * msStep);
        const temp = parseFloat((Math.random() * 45 - 5).toFixed(1));
        docs.push({ city, temperature: temp, unit: "°C", timestamp: ts, source: "seed" });
      }
    }
    await Reading.insertMany(docs);
    return res.json({ ok: true, inserted: docs.length });
  } catch (err) {
    next(err);
  }
});

export default router;
