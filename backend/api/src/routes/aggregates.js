import { Router } from "express";
import Reading from "../models/reading.js";

const router = Router();

// GET /api/aggregates?city=Shanghai&from=ts&to=ts&interval=hour|day
router.get("/", async (req, res, next) => {
  try {
    const { city, from, to, interval = "hour" } = req.query;
    const match = {};
    if (city) match.city = city;
    if (from || to) match.timestamp = {};
    if (from) match.timestamp.$gte = Number(from);
    if (to) match.timestamp.$lte = Number(to);

    // pipeline: agrupar por intervalo (hour/day) usando timestamp ms -> convert to ISODate
    const groupBy =
      interval === "day"
        ? { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$timestamp" } } }
        : { $dateToString: { format: "%Y-%m-%dT%H:00:00", date: { $toDate: "$timestamp" } } };

    const pipeline = [
      { $match: match },
      { $group: {
          _id: { period: groupBy, city: "$city" },
          avgTemp: { $avg: "$temperature" },
          minTemp: { $min: "$temperature" },
          maxTemp: { $max: "$temperature" },
          count: { $sum: 1 }
      }},
      { $sort: { "_id.period": 1 } }
    ];

    const resAgg = await Reading.aggregate(pipeline);
    return res.json({ result: resAgg });
  } catch (err) {
    next(err);
  }
});

export default router;
