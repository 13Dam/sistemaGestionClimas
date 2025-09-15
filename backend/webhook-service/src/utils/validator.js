/**
 * Valida el payload recibido en el webhook
 * @param {Object} data - Payload a validar
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export function validatePayload(data) {
  const errors = [];

  // Verificar que data sea un objeto
  if (!data || typeof data !== "object") {
    errors.push("Payload no es un objeto válido");
    return { isValid: false, errors };
  }

  // city: obligatorio, string no vacío
  if (!data.city || typeof data.city !== "string" || !data.city.trim()) {
    errors.push("city es obligatorio y debe ser un string no vacío");
  }

  // temperature: obligatorio, número
  if (data.temperature === undefined || typeof data.temperature !== "number") {
    errors.push("temperature es obligatorio y debe ser un número");
  }

  // unit: opcional, si existe debe ser string
  if (data.unit !== undefined && typeof data.unit !== "string") {
    errors.push("unit debe ser un string si está presente");
  }

  // timestamp: obligatorio, número o string que pueda convertirse a número
  if (data.timestamp === undefined || isNaN(Number(data.timestamp))) {
    errors.push("timestamp es obligatorio y debe ser un número válido");
  }

  // source: obligatorio, string no vacío
  if (!data.source || typeof data.source !== "string" || !data.source.trim()) {
    errors.push("source es obligatorio y debe ser un string no vacío");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
