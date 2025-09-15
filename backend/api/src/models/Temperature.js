import mongoose from 'mongoose';

const temperatureSchema = new mongoose.Schema({
  traceId: {
    type: String,
    required: true,
    unique: true
  },
  city: {
    type: String,
    required: true,
    index: true // index para búsquedas rápidas por ciudad
  },
  temperature: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    default: "°C"
  },
  timestamp: {
    type: Number,
    required: true,
    index: true // index para búsquedas por rango de tiempo
  },
  source: {
    type: String,
    required: true,
  },
  receivedAt: {
    type: Date,
    required: true
  }
}, {
  versionKey: false,
  timestamps: false // ya tenés receivedAt
});

const Temperature = mongoose.model('Temperature', temperatureSchema);

export default Temperature;
