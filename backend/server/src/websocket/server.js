import WebSocket, { WebSocketServer } from "ws";
import logger from "../utils/logger.js";
import config from "../config/index.js";
import { handleIncomingData } from "../services/dataHandler.js";

//Inicializa el servidor WebSocket.
export function startWebSocketServer() {
  const wss = new WebSocketServer({ port: config.PORT });

  wss.on("listening", () => {
    logger.info(`Servidor WebSocket escuchando en ws://localhost:${config.PORT} [MODE=${config.MODE}]`);
  });

  wss.on("connection", (ws, req) => {
    const clientIP = req.socket.remoteAddress;
    logger.info(`Nuevo cliente conectado desde ${clientIP}`);

    ws.on("message", async (message) => {
      logger.info("Mensaje recibido del cliente", { message: message.toString() });

      try {
        await handleIncomingData(message.toString());
      } catch (err) {
        logger.error("Error manejando mensaje entrante", err);
      }
    });

    ws.on("close", () => {
      logger.warn(`Cliente desconectado: ${clientIP}`);
    });

    ws.on("error", (err) => {
      logger.error(`Error en conexión WS con ${clientIP}`, err);
    });
  });

  return wss;
}
