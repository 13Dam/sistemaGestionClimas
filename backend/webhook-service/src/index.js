import express from "express";
import config from "./config/index.js";
import webhookRouter from "./routes/webhook.js";
import { requestLogger } from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

//middleware global
app.use(express.json());
app.use(requestLogger);

//rutas
app.use("/webhook", webhookRouter);

//middleware de manejo de errores (al final)
app.use(errorHandler);

//levantar servidor
app.listen(config.PORT, () => {
  console.log(`Webhook-service escuchando en puerto ${config.PORT} | MODE=${config.MODE}`);
  
  if (config.DEBUG) {
    console.log("DEBUG activado: se mostrarán logs detallados");
  }
});

// comportamiento diferente según modo
if (config.MODE === "test") {
  console.log("Webhook-service corriendo en modo TEST");
} else if (config.MODE === "prod") {
  console.log("Webhook-service corriendo en modo PROD");
}
