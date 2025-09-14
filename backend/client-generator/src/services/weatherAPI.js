import axios from "axios";
import config from "../config/index.js";
import { logError } from "../utils/logger.js";

/**
 *obtiene la temperatura actual de una ciudad desde WeatherAPI.com
 * @param {string} city - nombre de la ciudad
 * @returns {Promise<{ city: string, temperature: number, timestamp: string }>}
 */
export async function getTemperature(city) {
  try {
    const response = await axios.get(`${config.weatherApiUrl}/current.json`, {
      params: {
        key: config.weatherApiKey,
        q: city,
        aqi: "no",
      },
    });

    const data = response.data;

    // normaliza la salida
    return {
      city: data.location.name,
      temperature: data.current.temp_c,
      timestamp: new Date().toISOString(), // UTC
    };
  } catch (error) {
    logError(`❌ Error al obtener datos de clima para ${city}: ${error.message}`);
    throw error;
  }
}

/**
 * obtiene la temperatura actual de todas las ciudades definidas en config.cities
 * @returns {Promise<Array<{ city: string, temperature: number, timestamp: string }>>}
 */
export async function getAllTemperatures() {
  const results = [];
  for (const city of config.cities) {
    try {
      const data = await getTemperature(city);
      results.push(data);
    } catch (error) {
      //si falla una ciudad, no detiene a las demás
      logError(`No se pudo obtener clima de ${city}`);
    }
  }
  return results;
}

