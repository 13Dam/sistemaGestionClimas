function generateRandomTemperature(city) {
  const min = -5;
  const max = 40;

  const temperature = (Math.random() * (max - min) + min).toFixed(1); // 1 decimal
  const timestamp = Date.now(); // Epoch UTC en ms

  return {
    city,
    temperature: parseFloat(temperature),
    unit: "°C",
    timestamp
  };
}

export { generateRandomTemperature };
