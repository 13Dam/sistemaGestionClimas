import axios from "axios";
import logger from "../utils/logger.js";
import config from "../config/index.js";

const httpClient = axios.create({
  timeout: 5000, // 5 seg
});

/**
 * Envía datos a un microservicio destino vía HTTP POST.
 * @param {string} url - URL del microservicio destino.
 * @param {object} data - Payload a enviar.
 */
export async function postData(url, data) {
  try {
    const res = await httpClient.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.JWT_SECRET || ""}`,
      },
    });
    logger.info(`POST exitoso a ${url}`, res.data);
    return res.data;
  } catch (error) {
    logger.error(`Error enviando POST a ${url}: ${error.message}`);
    throw error;
  }
}
