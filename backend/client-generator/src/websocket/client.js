import WebSocket from "ws";
import config from "../config/index.js";
import { logInfo, logError } from "../utils/logger.js";

let ws;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

function connect() {
  ws = new WebSocket(config.wsServerUrl);

  ws.on("open", () => {
    logInfo(`✅ Conectado al WebSocket Server en ${config.wsServerUrl}`);
    reconnectAttempts = 0;
  });

  ws.on("close", () => {
    logError("❌ Conexión cerrada con el servidor WebSocket.");
    attemptReconnect();
  });

  ws.on("error", (err) => {
    logError(`⚠️ Error en WebSocket: ${err.message}`);
    ws.close();
  });
}

function sendData(data) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
    logInfo(`📤 Enviado: ${JSON.stringify(data)}`);
  }
}

function attemptReconnect() {
  if (reconnectAttempts < maxReconnectAttempts) {
    reconnectAttempts++;
    const delay = reconnectAttempts * 2000;
    logInfo(`🔄 Reintentando conexión en ${delay / 1000}s...`);
    setTimeout(connect, delay);
  } else {
    logError("🚨 Máximo número de reintentos alcanzado. Abortando.");
  }
}

export { connect, sendData };
