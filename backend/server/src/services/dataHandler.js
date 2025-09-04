// src/services/dataHandler.js
import { postData } from "./httpClient.js";
import validator from "../utils/validator.js";
import logger from "../utils/logger.js";
import config from "../config/index.js";

/**
 * Procesa el mensaje recibido del cliente WS.
 * @param {string} rawMessage - Mensaje en formato string (JSON).
 */
export async function handleIncomingData(rawMessage) {
  try {
    const parsed = JSON.parse(rawMessage);

    // 1. Validar datos
    const { valid, errors } = validator.validatePayload(parsed);
    if (!valid) {
      logger.warn("Payload inválido", errors);
      return;
    }

    // 2. Normalizar datos (ejemplo: asegurar °C y timestamp UTC)
    const normalizedData = {
      city: parsed.city,
      temperature: Number(parsed.temperature),
      unit: "°C",
      timestamp: parsed.timestamp || Date.now(),
    };
/* 
    // 3. Enviar al webhook
    if (config.WEBHOOK_URL) {
      await postData(config.WEBHOOK_URL, normalizedData);
    }

    // 4. Enviar a la API base de datos (opcional, según flujo)
    if (config.API_URL) {
      await postData(config.API_URL, normalizedData);
    } */

    logger.info("Datos procesados y reenviados con éxito", normalizedData);
  } catch (error) {
    logger.error("Error procesando mensaje entrante", error);
  }
}
