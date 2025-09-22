// Función para verificar si la API está corriendo
async function checkEstadoApi() {
  const badge = document.getElementById("EstadoApi");

  try {
    const res = await fetch("http://localhost:3000/api/temperature", { method: "GET" });
    if (res.ok) {
      // API corriendo
      badge.classList.remove("bg-danger");
      badge.classList.add("bg-success");
      badge.textContent = "🟢 API Conectada";
    } else {
      // API responde pero con error
      badge.classList.remove("bg-success");
      badge.classList.add("bg-danger");
      badge.textContent = "🔴 API Desconectada";
    }
  } catch (err) {
    // No hay conexión
    badge.classList.remove("bg-success");
    badge.classList.add("bg-danger");
    badge.textContent = "🔴 API Desconectada";
  }
}

// mapeo entre id del checkbox y nombre real en la API
const cityMap = {
  shanghai: "Shanghai",
  berlin: "Berlin",
  rio: "Rio De Janeiro"
};

//Objeto global para ir guardando las últimas temperaturas
const temperaturasActuales = {};

document.addEventListener("DOMContentLoaded", () => {
  checkEstadoApi();
  Object.keys(cityMap).forEach(cityKey => {
    const checkbox = document.getElementById(cityKey);
    //render inicial
    actualizarPanelCiudad(cityKey, checkbox.checked);

    //escuchar cambios en los checkboxes
    checkbox.addEventListener("change", () => {
      actualizarPanelCiudad(cityKey, checkbox.checked);
    });
  });
});
//función para actualizar un panel según selección
async function actualizarPanelCiudad(cityKey, isChecked) {
  const panel = document.querySelector(`.card-body-${cityKey}`);
  const cityName = cityMap[cityKey]; // Ej: "Berlin"

  if (!isChecked) {
    panel.querySelector("p.display-5").textContent = "- °C";
    panel.querySelector("p.text-white.fs-5").textContent = "⏰ -";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/temperature/${cityName}`);
    const data = await res.json();
    console.log("API response for", cityName, ":", data); //debu

    if (data.length > 0) {
      const latest = data[0]; // último registro
      var date = new Date(latest.timestamp * 1000);

      // horas del timestamp
      var hours = date.getHours();
      // minutos del timestamp
      var minutes = "0" + date.getMinutes();
      // segundos del timestamp
      var seconds = "0" + date.getSeconds();

      // mostrar tiempo en formato 10:30:23
      var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      panel.querySelector("p.display-5").textContent = `${latest.temperature} °C`;
      panel.querySelector("p.text-white.fs-5").textContent = `⏰ ${formattedTime}`;
      
      //guarda la temperatura 
      temperaturasActuales[cityKey] = {
        ciudad: cityName,
        temperatura: latest.temperature
      };
      
      //recalcula las extremas
      actualizarExtremos();
      } else {
        panel.querySelector("p.display-5").textContent = "- °C";
        panel.querySelector("p.text-black.fs-5").textContent = "⏰ -";
        temperaturasActuales[cityKey] = null;
        actualizarExtremos();
      }
    } catch (err) {
      console.error("Error obteniendo datos de API:", err);
      panel.querySelector("p.display-5").textContent = "⚠️";
      panel.querySelector("p.text-white.fs-5").textContent = "Error";
    }
  }

function actualizarExtremos() {
  const valores = Object.values(temperaturasActuales).filter(v => v !== null);

  if (valores.length === 0) return;

  const masFria = valores.reduce((min, c) =>
    c.temperatura < min.temperatura ? c : min
  );
  const masCalida = valores.reduce((max, c) =>
    c.temperatura > max.temperatura ? c : max
  );

  //actualizar card de más fría
  const cardFria = document.querySelector(".card-body-ciudadFria");
  cardFria.querySelector("p.display-5").textContent = `${masFria.temperatura} °C`;
  cardFria.querySelector("p.text-black.fs-5").textContent = `📍 ${masFria.ciudad}`;

  //actualizar card de más cálida
  const cardCalida = document.querySelector(".card-body-ciudadCalida");
  cardCalida.querySelector("p.display-5").textContent = `${masCalida.temperatura} °C`;
  cardCalida.querySelector("p.text-black.fs-5").textContent = `📍 ${masCalida.ciudad}`;
}


document.getElementById("btnLooker").addEventListener("click", () => {
    window.open("https://lookerstudio.google.com/reporting/f5c1582d-67c3-49ca-9ac4-286c31be0d51", "_blank");
  });