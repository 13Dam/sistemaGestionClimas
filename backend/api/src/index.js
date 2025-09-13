import express from "express";
import { getWeather } from "./services/weatherService.js";

const router = express.Router();

router.get("/weather/:city", async (req, res) => {
  try {
    const weather = await getWeather(req.params.city);
    res.json(weather);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
