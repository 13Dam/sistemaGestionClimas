import config from "./config/index.js";
import { connect, sendData } from "./websocket/client.js";
import { generateRandomTemperature } from "./services/randomGenerator.js";
import { getTemperature, getAllTemperatures } from "./services/weatherAPI.js";
import { logInfo, logError } from "./utils/logger.js";

//decide qué fuente de datos usar
async function fetchData() {
  if (config.mode === "prod") {
    //devuelve un array con datos de todas las ciudades
    return await getAllTemperatures();
  } else {
    //genera datos random por ciudad
    return config.cities.map((city) => generateRandomTemperature(city));
  }
}

async function sendTemperatures() {
  try {
    const dataArray = await fetchData();

    // Enviar cada objeto individual al WebSocket server
    for (const data of dataArray) {
      sendData(data); // 👈 ya manda y loguea
      // ❌ sacá este log extra
      // logInfo(`📤 Enviado: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    logError(`❌ Error al obtener o enviar datos: ${err.message}`);
  }
}


// Iniciar microservicio
function start() {
  logInfo(`🚀 Iniciando client-generator en modo [${config.mode}]...`);
  connect();

  // 1️⃣ Ejecutar inmediatamente al iniciar
  sendTemperatures();

  // 2️⃣ Ejecutar periódicamente según la frecuencia
  setInterval(sendTemperatures, config.frequency);
}

start();

/* //iniciar microservicio
function start() {
  logInfo(`🚀 Iniciando client-generator en modo [${config.mode}]...`);
  connect();

  setInterval(async () => {
    try {
      const dataArray = await fetchData();

      // Enviar cada objeto individual al WebSocket server
      for (const data of dataArray) {
        sendData(data);
      }
    } catch (err) {
      logError(`❌ Error al obtener o enviar datos: ${err.message}`);
    }
  }, config.frequency);
}

start(); */

