function generateRandomTemperature(city) {
  const min = -5;
  const max = 40;

  const temperature = (Math.random() * (max - min) + min).toFixed(1); // 1 decimal
  const timestamp = new Date().toISOString(); // igual que en prod

  return {
    city,
    temperature: parseFloat(temperature),
    unit: "°C",
    timestamp,
    source: "random"   // 👈 agregado
  };
}

export { generateRandomTemperature };

