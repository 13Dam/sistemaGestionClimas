/**
 * Valida el payload de temperatura
 * @param {Object} data - Objeto recibido en el POST
 * @returns {Object} - { valid: Boolean, errors: Array<String> }
 */
export function validateTemperaturePayload(data) {
  const errors = [];

  if (!data.city || typeof data.city !== 'string') {
    errors.push("El campo 'city' es obligatorio y debe ser un string.");
  }

  if (data.temperature === undefined || typeof data.temperature !== 'number') {
    errors.push("El campo 'temperature' es obligatorio y debe ser un número.");
  }

  if (!data.unit || typeof data.unit !== 'string') {
    errors.push("El campo 'unit' es obligatorio y debe ser un string.");
  }

  if (!data.timestamp || typeof data.timestamp !== 'number') {
    errors.push("El campo 'timestamp' es obligatorio y debe ser un número.");
  }

  if (!data.source || typeof data.source !== 'string') {
    errors.push("El campo 'source' es obligatorio y debe ser un string.");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
