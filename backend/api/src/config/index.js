import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  MODE: process.env.MODE || "prod",   // test | prod
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017", //URI de MongoDB
  DB_NAME: process.env.DB_NAME || "climate_readings",
  JWT_SECRET: process.env.JWT_SECRET || "secret_key", //clave para validar JWT
  LOG_LEVEL: process.env.LOG_LEVEL || "info",  //nivel de logs
  DEBUG: process.env.DEBUG === "true",  //flag de debug
};

export default config;
