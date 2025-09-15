import dotenv from "dotenv";

dotenv.config(); // cargar .env

const config = {
  mode: process.env.MODE || "test", // test | prod
  wsServerUrl: process.env.WS_SERVER_URL || "ws://localhost:4000",

  // frecuencia fija según el modo
  frequency: process.env.MODE === "prod" ? 30 * 60 * 1000 : 5000, 
  // 30 min en prod, 5s en test

  cities: process.env.CITIES
    ? process.env.CITIES.split(",").map((c) => c.trim())
    : ["Shanghai", "Berlin", "Rio de Janeiro"],

  // configuración para WeatherAPI
  weatherApiKey: process.env.WEATHER_API_KEY || "",
  weatherApiUrl: process.env.WEATHER_API_URL || "http://api.weatherapi.com/v1",
};

export default config;

export const {
  mode,
  wsServerUrl,
  frequency,
  cities,
  weatherApiKey,
  weatherApiUrl,
} = config;
