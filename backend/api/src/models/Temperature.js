import mongoose from 'mongoose';

const temperatureSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
  }
}, {
  versionKey: false // elimina el campo __v que Mongoose agrega por defecto
});

const Temperature = mongoose.model('Temperature', temperatureSchema);

export default Temperature;


