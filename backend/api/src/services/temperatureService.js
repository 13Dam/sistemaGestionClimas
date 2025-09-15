import Temperature from '../models/Temperature.js';
import logger from '../utils/logger.js';

/**
 * crea un nuevo registro de temperatura en la base de datos
 * @param {Object} data - { city, temperature, unit, timestamp, source }
 * @returns {Object} - Registro creado
 */
export async function createTemperature(data) {
  try {
    const temp = new Temperature(data);
    const saved = await temp.save();
    logger.info(`Temperatura guardada: ${saved.city} - ${saved.temperature}${saved.unit}`);
    return saved;
  } catch (err) {
    logger.error('Error guardando temperatura', err);
    throw err;
  }
}

/**
 * obtiene todos los registros de temperatura, ordenados por timestamp descendente
 * @returns {Array} - array de registros
 */
export async function getAllTemperatures() {
  try {
    return await Temperature.find().sort({ timestamp: -1 });
  } catch (err) {
    logger.error('Error obteniendo todas las temperaturas', err);
    throw err;
  }
}

/**
 * Obtiene registros filtrados por ciudad
 * @param {String} city 
 * @returns {Array} - Array de registros
 */
export async function getTemperaturesByCity(city) {
  try {
    return await Temperature.find({ city }).sort({ timestamp: -1 });
  } catch (err) {
    logger.error(`Error obteniendo temperaturas para la ciudad: ${city}`, err);
    throw err;
  }
}

/**
 * obtiene registros filtrados por rango de timestamp
 * @param {Number} from - timestamp inicial
 * @param {Number} to - timestamp final
 * @returns {Array} - array de registros
 */
export async function getTemperaturesByRange(from, to) {
  try {
    return await Temperature.find({
      timestamp: { $gte: from, $lte: to }
    }).sort({ timestamp: -1 });
  } catch (err) {
    logger.error(`Error obteniendo temperaturas entre ${from} y ${to}`, err);
    throw err;
  }
}
