import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 4000,
  MODE: process.env.MODE || "test", // test | prod
  WEBHOOK_URL: process.env.WEBHOOK_URL || "",
  WEBHOOK_URL: process.env.WEBHOOK_URL || "", // URL del webhook-service
  JWT_SECRET: process.env.JWT_SECRET || "",
  LOG_LEVEL: process.env.LOG_LEVEL || "info", // para ajustar nivel de logs
};

export default config;
