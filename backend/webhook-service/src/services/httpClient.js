import axios from "axios";
import { logger } from "../middlewares/logger.js";
import dotenv from "dotenv";

dotenv.config();

const FINAL_API_URL = process.env.FINAL_API_URL || "http://localhost:5000/api/temperature";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/**
 * Envía datos a la API final con reintentos
 * @param {Object} data - Payload procesado
 * @returns {Promise<void>}
 */
export async function sendToFinalAPI(data) {
  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      await axios.post(FINAL_API_URL, data, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.API_TOKEN || ""}` // para el TOKEN
        },
        timeout: 5000,
      });

      logger.info(`Payload enviado a API final con traceId=${data.traceId}`);
      return; // éxito, salir de la función

    } catch (error) {
      attempt++;
      logger.warn(`Error enviando payload a API final (intento ${attempt}): ${error.message}`);

      if (attempt >= MAX_RETRIES) {
        logger.error(`No se pudo enviar el payload después de ${MAX_RETRIES} intentos. traceId=${data.traceId}`);
        throw new Error(`Falló el envío a la API final: ${error.message}`);
      }

      // esperar un tiempo antes de reintentar
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}
