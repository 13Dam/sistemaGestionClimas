import config from "./config/index.js";
import logger from "./utils/logger.js";
import { startWebSocketServer } from "./websocket/server.js";

async function bootstrap() {
  try {
    logger.info("Iniciando microservicio WebSocket Server...");
    logger.info(`Modo: ${config.MODE}`);

    //arrancar servidor WS
    startWebSocketServer();

    //health check de arranque
    logger.info(`Microservicio listo en ws://localhost:${config.PORT}`);
  } catch (error) {
    logger.error("Error crítico al iniciar el servidor", error);
    process.exit(1); // salir con error
  }
}

// capturar errores no controlados
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

bootstrap();
