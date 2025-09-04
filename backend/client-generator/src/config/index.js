import dotenv from "dotenv";

dotenv.config(); // Cargar .env

const config = {
  mode: process.env.MODE || "test", // test | prod
  wsServerUrl: process.env.WS_SERVER_URL || "ws://localhost:4000",
  frequency: parseInt(process.env.FREQUENCY, 10) || 5000, // ms
  cities: process.env.CITIES
    ? process.env.CITIES.split(",").map((c) => c.trim())
    : ["Shanghai", "Berlin", "Rio de Janeiro"],
};

export default config;
