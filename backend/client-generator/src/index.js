import config from "./config/index.js";
import { connect, sendData } from "./websocket/client.js";
import { generateRandomTemperature } from "./services/randomGenerator.js";
import { getWeather } from "./services/weatherAPI.js"; // Futuro
import { logInfo } from "./utils/logger.js";

// Decide qué fuente de datos usar
async function fetchData(city) {
  if (config.mode === "prod") {
    return await getWeather(city); // Datos reales de API
  } else {
    return generateRandomTemperature(city); // Datos random
  }
}

// Iniciar microservicio
function start() {
  logInfo(`🚀 Iniciando client-generator en modo [${config.mode}]...`);
  connect();

  setInterval(async () => {
    for (const city of config.cities) {
      const data = await fetchData(city);
      sendData(data);
    }
  }, config.frequency);
}

start();
