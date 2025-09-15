import mongoose from "mongoose";
import logger from "../utils/logger.js";

export async function connectMongo(uri) {
  try {
    await mongoose.connect(uri, {
      dbName: "climate_readings",
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    logger.info("MongoDB conectado");

    mongoose.connection.on("connected", () => {
      logger.info("MongoDB connection established");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error", err);
    });

  } catch (err) {
    logger.error("Error conectando MongoDB", err);
    throw err;
  }
}
