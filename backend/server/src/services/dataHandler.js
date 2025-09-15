import { postData } from "./httpClient.js";
import validator from "../utils/validator.js";
import logger from "../utils/logger.js";
import config from "../config/index.js";

/**
 * procesa el mensaje recibido del cliente WS.
 * @param {string} rawMessage
 */
export async function handleIncomingData(rawMessage) {
  try {
    //parsear mensaje JSON
    const parsed = JSON.parse(rawMessage);

    // validar datos
    const { valid, errors } = validator.validatePayload(parsed);
    if (!valid) {
      logger.warn("Payload inválido recibido", errors);
      return;
    }

    // normalizar datos
    const normalizedData = {
      city: parsed.city,
      temperature: Number(parsed.temperature),
      unit: "°C",
      timestamp: parsed.timestamp || Date.now(),
      source: parsed.source || "random", // usa lo que envía client-generator
    };
    
    // enviar al Webhook
    if (config.WEBHOOK_URL) {
      try {
        await postData(config.WEBHOOK_URL, normalizedData);
      } catch (err) {
        logger.error("Error enviando POST al webhook", err);
      }
    }

    //log de éxito
    logger.info("Datos procesados y reenviados con éxito", normalizedData);

  } catch (error) {
    //captura errores de JSON.parse u otros
    logger.error("Error procesando mensaje entrante", error);
  }
}
