import express from 'express';
import auth from '../middlewares/auth.js';
import { validateTemperaturePayload } from '../utils/validator.js';
import {
  createTemperature,
  getAllTemperatures,
  getTemperaturesByCity,
  getTemperaturesByRange
} from '../services/temperatureService.js';

const router = express.Router();

// POST protegido con JWT
router.post('/temperature', auth, async (req, res, next) => {
  try {
    const { valid, errors } = validateTemperaturePayload(req.body);

    if (!valid) {
      return res.status(400).json({ errors });
    }

    const result = await createTemperature(req.body);
    res.status(201).json(result);

  } catch (err) {
    next(err);
  }
});

// GET protegidos con JWT
router.get('/temperature', auth, async (req, res, next) => {
  try {
    const { from, to } = req.query;

    if (from && to) {
      const readings = await getTemperaturesByRange(Number(from), Number(to));
      return res.json(readings);
    }

    const readings = await getAllTemperatures();
    res.json(readings);

  } catch (err) {
    next(err);
  }
});

router.get('/temperature/:city', auth, async (req, res, next) => {
  try {
    const { city } = req.params;
    const readings = await getTemperaturesByCity(city);
    res.json(readings);
  } catch (err) {
    next(err);
  }
});

// GET público para Power BI (sin JWT)
router.get('/public/temperature', async (req, res, next) => {
  try {
    const readings = await getAllTemperatures();
    res.json(readings);
  } catch (err) {
    next(err);
  }
});


export default router;
