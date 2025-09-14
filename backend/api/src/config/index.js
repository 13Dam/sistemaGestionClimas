import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: parseInt(process.env.PORT || "8083", 10),
  MODE: process.env.MODE || "test",
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/readingsdb",
  API_KEY: process.env.API_KEY || "", // opcional para auth simple
  ALLOWED_CITIES: (process.env.ALLOWED_CITIES || "Shanghai,Berlin,Rio de Janeiro").split(",").map(s => s.trim())
};

export default config;
