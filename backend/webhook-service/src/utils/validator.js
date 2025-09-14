import config from "../config/index.js";

export function validatePayload(data) {
  const errors = [];

  if (!data || typeof data !== "object") {
    errors.push("payload_must_be_object");
    return { valid: false, errors };
  }

  // Ciudad (ojo: que coincida con tus MS1/MS2; usa "Shanghai" no "Shangai")
  if (!data.city || !config.ALLOWED_CITIES.includes(data.city)) {
    errors.push(`invalid_city:${data.city}`);
  }

  // Temperatura
  if (typeof data.temperature !== "number" || Number.isNaN(data.temperature)) {
    errors.push("temperature_must_be_number");
  }

  // Unidad
  if (data.unit && data.unit !== "°C") {
    errors.push("unit_must_be_Celsius");
  }

  // Timestamp (ms UTC)
  if (typeof data.timestamp !== "number" || !Number.isFinite(data.timestamp)) {
    errors.push("timestamp_invalid");
  }

  return { valid: errors.length === 0, errors };
}

export function normalize(data) {
  return {
    city: data.city,
    temperature: Number(data.temperature),
    unit: "°C",
    timestamp: data.timestamp ?? Date.now(),
    source: data.source ?? "test" // opcional
  };
}
