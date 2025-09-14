import mongoose from "mongoose";
import logger from "../utils/logger.js";

export async function connectMongo(uri) {
  try {
    await mongoose.connect(uri, { dbName: "climate_readings" });
    logger.info("MongoDB conectado");
  } catch (err) {
    logger.error("Error conectando MongoDB", err);
    throw err;
  }
}
