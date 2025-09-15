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

//POST /temperature
//Recibe datos del webhook-service, valida JWT, guarda en DB
/* router.post('/temperature', auth, async (req, res, next) => { */ //CUANDO SE IMPLEMENTE AUTENTICACIÓN
router.post('/temperature', async (req, res, next) => {
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

//GET /temperature
//Devuelve todos los datos, puede usar query params from/to para filtrar por timestamp
router.get('/temperature', async (req, res, next) => {
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

//GET /temperature/:city
//Devuelve registros filtrados por ciudad
router.get('/temperature/:city', async (req, res, next) => {
  try {
    const { city } = req.params;
    const readings = await getTemperaturesByCity(city);
    res.json(readings);
  } catch (err) {
    next(err);
  }
});

export default router;
