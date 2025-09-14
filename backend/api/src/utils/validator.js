export function validatePayload(p, allowedCities = ["Shanghai","Berlin","Rio de Janeiro"]) {
  const errors = [];
  if (!p || typeof p !== "object") { errors.push("payload_must_be_object"); return { valid: false, errors }; }
  if (!p.city || !allowedCities.includes(p.city)) errors.push(`invalid_city:${p.city}`);
  if (typeof p.temperature !== "number" || Number.isNaN(p.temperature)) errors.push("temperature_must_be_number");
  if (p.unit && p.unit !== "°C") errors.push("unit_must_be_Celsius");
  if (typeof p.timestamp !== "number" || !Number.isFinite(p.timestamp)) errors.push("timestamp_invalid");
  return { valid: errors.length === 0, errors };
}
