import axios from "axios";
import config from "../config/index.js";
import logger from "../utils/logger.js";

const http = axios.create({ timeout: 5000 });

// Reenvía datos a MS4
export async function forwardToApi(normalizedData) {
  let attempt = 0;
  let lastError = null;

  while (attempt < config.FORWARD_MAX_RETRIES) {
    attempt++;
    try {
      const res = await http.post(config.API_URL, normalizedData, {
        headers: { "Content-Type": "application/json" }
      });
      logger.info("Forward OK", { status: res.status });
      return res.data;
    } catch (err) {
      lastError = err;
      logger.warn("Forward failed, retrying...", { attempt, msg: err.message });
      await new Promise(r => setTimeout(r, config.FORWARD_RETRY_MS));
    }
  }
  logger.error("Forward failed permanently", { error: lastError?.message });
  throw lastError;
}
