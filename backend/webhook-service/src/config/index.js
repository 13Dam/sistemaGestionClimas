import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: parseInt(process.env.PORT || "8082", 10),
  MODE: process.env.MODE || "test",
  API_URL: process.env.API_URL || "http://localhost:8083/api/readings",
  INBOUND_JWT_SECRET: process.env.INBOUND_JWT_SECRET || "",
  OUTBOUND_JWT_SECRET: process.env.OUTBOUND_JWT_SECRET || "",
  FORWARD_MAX_RETRIES: parseInt(process.env.FORWARD_MAX_RETRIES || "3", 10),
  FORWARD_RETRY_MS: parseInt(process.env.FORWARD_RETRY_MS || "1500", 10),
  ALLOWED_CITIES: (process.env.ALLOWED_CITIES || "Shanghai,Berlin,Rio de Janeiro")
    .split(",")
    .map(s => s.trim())
};

export default config;
