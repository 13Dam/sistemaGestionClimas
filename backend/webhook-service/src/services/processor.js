//lógica de validación, enriquecimiento y filtrado

import { v4 as uuidv4 } from "uuid";
import { validatePayload } from "../utils/validator.js";
import { logger } from "../middlewares/logger.js";

/**
 * Procesa los datos recibidos del server-ws
 * @param {Object} data - Payload recibido
 * @returns {Object} - Payload enriquecido listo para enviar a la API final
 * @throws {Error} - Si el payload es inválido
 */
export function processData(data) {
  // 1. Validación de campos obligatorios
  const { isValid, errors } = validatePayload(data);
  if (!isValid) {
    const errorMsg = `Payload inválido: ${errors.join(", ")}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  // 2. Enriquecimiento: agregar traceId y timestamp de recepción
  const enrichedData = {
    ...data,
    traceId: uuidv4(),
    receivedAt: Date.now(),
  };

  // 3. Normalización
  if (!enrichedData.unit) {
    enrichedData.unit = "°C";
  }

  // 4. Filtrado
  if (enrichedData.temperature < -50 || enrichedData.temperature > 60) {
    const errorMsg = `Temperatura fuera de rango: ${enrichedData.temperature}`;
    logger.warn(errorMsg);
    throw new Error(errorMsg);
  }

  logger.info(`Payload procesado con traceId=${enrichedData.traceId}`);
  return enrichedData;
}
