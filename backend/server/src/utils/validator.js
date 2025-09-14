// src/utils/validator.js
const allowedCities = ["Shanghai", "Berlin", "Rio de Janeiro"];

function validatePayload(data) {
  const errors = [];

  // Validar ciudad
  if (!data.city || !allowedCities.includes(data.city)) {
    errors.push(`Ciudad inválida: ${data.city}`);
  }

  // Validar temperatura
  if (typeof data.temperature !== "number" || isNaN(data.temperature)) {
    errors.push("La temperatura debe ser un número válido");
  }

  // Validar unidad
  if (data.unit && data.unit !== "°C") {
    errors.push("Unidad inválida, solo se acepta °C");
  }

  // Validar timestamp
  if (!data.timestamp || typeof data.timestamp !== "number") {
    errors.push("Timestamp faltante o inválido");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export default { validatePayload };
