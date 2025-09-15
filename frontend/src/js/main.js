// Mapeo entre id del checkbox y nombre real en la API
const cityMap = {
  shanghai: "Shanghai",
  berlin: "Berlin",
  rio: "Rio De Janeiro"
};

document.addEventListener("DOMContentLoaded", () => {
  Object.keys(cityMap).forEach(cityKey => {
    const checkbox = document.getElementById(cityKey);
    // Render inicial
    actualizarPanelCiudad(cityKey, checkbox.checked);

    // Escuchar cambios en los checkboxes
    checkbox.addEventListener("change", () => {
      actualizarPanelCiudad(cityKey, checkbox.checked);
    });
  });
});
// Función para actualizar un panel según selección
async function actualizarPanelCiudad(cityKey, isChecked) {
  const panel = document.querySelector(`.card-body-${cityKey}`);
  const cityName = cityMap[cityKey]; // Ej: "Berlin"

  if (!isChecked) {
    panel.querySelector("p.display-6").textContent = "- °C";
    panel.querySelector("p.small").textContent = "⏰ -";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/temperature/${cityName}`);
    const data = await res.json();
    console.log("API response for", cityName, ":", data); // 👀 debu
    
    if (data.length > 0) {
      const latest = data[0]; // último registro
      var date = new Date(latest.timestamp * 1000);

      // Hours part from the timestamp
      var hours = date.getHours();

      // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();

      // Seconds part from the timestamp
      var seconds = "0" + date.getSeconds();

      // Will display time in 10:30:23 format
      var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      panel.querySelector("p.display-6").textContent = `${latest.temperature} °C`;
      panel.querySelector("p.small").textContent = `⏰ ${latest.formattedTime}`;
    } else {
      panel.querySelector("p.display-6").textContent = "- °C";
      panel.querySelector("p.small").textContent = "⏰ -";
    }
  } catch (err) {
    console.error("Error obteniendo datos de API:", err);
    panel.querySelector("p.display-6").textContent = "⚠️";
    panel.querySelector("p.small").textContent = "Error";
  }
}

document.getElementById("btnLooker").addEventListener("click", () => {
    window.open("https://lookerstudio.google.com/reporting/f5c1582d-67c3-49ca-9ac4-286c31be0d51", "_blank");
  });