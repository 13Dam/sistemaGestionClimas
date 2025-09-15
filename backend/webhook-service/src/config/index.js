import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 3001,
  MODE: process.env.MODE || "prod", // test | prod
  FINAL_API_URL: process.env.FINAL_API_URL || "http://localhost:5000/data", //API final
  API_TOKEN: process.env.API_TOKEN || "", //token para cuando re incopore auth
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  DEBUG: process.env.DEBUG === "true",
};

export default config;
