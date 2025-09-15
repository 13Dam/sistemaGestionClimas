const allowedCities = ["Shanghai", "Berlin", "Rio de Janeiro"];

function validatePayload(data) {
  const errors = [];

  //validar ciudad
  if (!data.city || !allowedCities.includes(data.city)) {
    errors.push(`Ciudad inválida: ${data.city}`);
  }

  //validar temperatura
  if (typeof data.temperature !== "number" || isNaN(data.temperature)) {
    errors.push("La temperatura debe ser un número válido");
  }

  //validar unidad (si existe, debe ser °C)
  if (data.unit && data.unit !== "°C") {
    errors.push("Unidad inválida, solo se acepta °C");
  }

  //validar timestamp
  let timestamp = data.timestamp;
  if (!timestamp) {
    errors.push("Timestamp faltante");
  } else {
    //convertir string ISO a número si es necesario
    if (typeof timestamp === "string") {
      const parsed = Date.parse(timestamp);
      if (isNaN(parsed)) {
        errors.push("Timestamp inválido");
      } else {
        data.timestamp = parsed; //lo normaliza a número
      }
    } else if (typeof timestamp !== "number") {
      errors.push("Timestamp inválido");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export default { validatePayload };

