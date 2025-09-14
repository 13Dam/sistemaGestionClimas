import mongoose from "mongoose";

const ReadingSchema = new mongoose.Schema({
  city: { type: String, required: true, index: true },
  temperature: { type: Number, required: true },
  unit: { type: String, default: "°C" },
  timestamp: { type: Number, required: true, index: true },
  source: { type: String, default: "unknown" }
}, { timestamps: true });

export default mongoose.model("Reading", ReadingSchema);
