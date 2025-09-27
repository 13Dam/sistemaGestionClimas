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
let tempChart; // variable global para el chart

async function renderChart(data) {
  // obtenemos qué ciudades están seleccionadas
  const ciudadesSeleccionadas = Object.keys(cityMap)
    .filter(key => document.getElementById(key).checked)
    .map(key => cityMap[key]);

  // preparamos los datasets para cada ciudad
  const datasets = ciudadesSeleccionadas.map(ciudad => {
    const datosCiudad = data
      .filter(d => d.city === ciudad)
      .sort((a, b) => new Date(a.receivedAt) - new Date(b.receivedAt));

    return {
      label: ciudad,
      data: datosCiudad.map(d => ({ x: new Date(d.receivedAt), y: d.temperature })),
      borderColor: ciudad === "Berlin" ? "#2980B9" : // celeste
        ciudad === "Shanghai" ? "#E74C3C" : // rojo
          ciudad === "Rio De Janeiro" ? "#27AE60" : // verde
            "#000000", // fallback
      backgroundColor: "transparent",

      tension: 0.3
    };
  });

  const ctx = document.getElementById("tempChart").getContext("2d");

  if (tempChart) {
    tempChart.destroy(); // destruimos el chart previo para no sobreponer
  }

  tempChart = new Chart(ctx, {
    type: "line",
    data: { datasets },
    options: {
      responsive: true,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "hour",
            displayFormats: {
              hour: "dd/MM/yyyy HH:mm" // formato para mostrar en el eje
            }
          },
          title: { display: true, text: "Tiempo" }
        }

      },
      plugins: {
        legend: { display: true },
        tooltip: { mode: "nearest", intersect: false }
      }
    }
  });
}

// Actualizar gráfico cuando se cambia un checkbox
Object.keys(cityMap).forEach(cityKey => {
  const checkbox = document.getElementById(cityKey);
  checkbox.addEventListener("change", async () => {
    try {
      const res = await fetch("http://localhost:3000/api/temperature");
      const data = await res.json();
      renderChart(data); // actualizar gráfico sin tocar la tabla
    } catch (err) {
      console.error("Error cargando datos para el gráfico:", err);
    }
  });
});

//Objeto global para ir guardando las últimas temperaturas
const temperaturasActuales = {};
document.addEventListener("DOMContentLoaded", async () => {
  checkEstadoApi();

  const data = await cargarHistorico();

  Object.keys(cityMap).forEach(cityKey => {
    const checkbox = document.getElementById(cityKey);
    actualizarPanelCiudad(cityKey, checkbox.checked);

    checkbox.addEventListener("change", () => {
      actualizarPanelCiudad(cityKey, checkbox.checked);
      renderChart(data);
    });
  });

  renderChart(data);

  let ultimaFecha = null;

  setInterval(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/temperature");
      const data = await res.json();

      const nuevaUltimaFecha = data.length ? new Date(data[0].receivedAt) : null;

      if (!ultimaFecha || (nuevaUltimaFecha && nuevaUltimaFecha > ultimaFecha)) {
        // 🔹 actualizar gráfico
        renderChart(data);

        // 🔹 actualizar paneles
        Object.keys(cityMap).forEach(cityKey => {
          const checkbox = document.getElementById(cityKey);
          actualizarPanelCiudad(cityKey, checkbox.checked);
        });

        // 🔹 actualizar tabla e estadísticas
        await cargarHistorico();

        ultimaFecha = nuevaUltimaFecha;
      }
    } catch (err) {
      console.error("Error actualizando automáticamente:", err);
    }
  }, 10 * 1000);

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
      var date = new Date(latest.receivedAt); // receivedAt ya es un Date en ISO


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
async function cargarHistorico() {
  try {
    const res = await fetch("http://localhost:3000/api/temperature");
    const data = await res.json();

    const tbody = document.querySelector("#tablaHistorico tbody");
    tbody.innerHTML = ""; // limpiar tabla

    data.forEach(item => {
      const date = new Date(item.receivedAt);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

      const row = `
        <tr>
          <td>${item.city}</td>
          <td>${item.temperature.toFixed(1)}</td>
          <td>${formattedDate}</td>
        </tr>
      `;
      tbody.insertAdjacentHTML("beforeend", row);
    });

    actualizarEstadisticas(data);

    // 🔹 Destruir DataTable si ya estaba inicializada
    if ($.fn.DataTable.isDataTable('#tablaHistorico')) {
      $('#tablaHistorico').DataTable().destroy();
    }

    // Inicializar DataTables
    $('#tablaHistorico').DataTable({
      pageLength: 5, // 3 a 5 registros por página
      lengthMenu: [3, 5, 10, 25],
      language: {
        search: "🔍 Buscar:",
        lengthMenu: "Mostrar _MENU_ registros",
        info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
        paginate: {
          first: "Primera",
          last: "Última",
          next: "Siguiente",
          previous: "Anterior"
        },
      }
    });

    return data;
  } catch (err) {
    console.error("Error cargando histórico:", err);
  }
}

// Función para actualizar estadísticas dinámicamente
function actualizarEstadisticas(data) {
  // Fecha de hoy a medianoche
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Filtrar solo datos de hoy
  const datosHoy = data.filter(item => {
    const fechaItem = new Date(item.receivedAt);
    return fechaItem >= hoy; // solo registros de hoy en adelante
  });

  // Agrupamos datos por ciudad
  const stats = {};

  datosHoy.forEach(item => {
    const ciudad = item.city;
    if (!stats[ciudad]) {
      stats[ciudad] = {
        total: 0,
        count: 0,
        min: item.temperature,
        max: item.temperature
      };
    }
    stats[ciudad].total += item.temperature;
    stats[ciudad].count += 1;
    if (item.temperature < stats[ciudad].min) stats[ciudad].min = item.temperature;
    if (item.temperature > stats[ciudad].max) stats[ciudad].max = item.temperature;
  });

  // Actualizamos el HTML
  Object.keys(cityMap).forEach(key => {
    const ciudadReal = cityMap[key]; // Ej: "Berlin"
    const card = document.querySelector(`.card-body-estadisticas .col-md-4:nth-child(${Object.keys(cityMap).indexOf(key) + 1})`);
    if (stats[ciudadReal]) {
      const promedio = (stats[ciudadReal].total / stats[ciudadReal].count).toFixed(1);
      const min = stats[ciudadReal].min.toFixed(1);
      const max = stats[ciudadReal].max.toFixed(1);

      card.querySelector("p:nth-child(2)").textContent = `Promedio: ${promedio} °C`;
      card.querySelector("p:nth-child(3)").textContent = `Mín: ${min} °C / Máx: ${max} °C`;
    } else {
      card.querySelector("p:nth-child(2)").textContent = `Promedio: - °C`;
      card.querySelector("p:nth-child(3)").textContent = `Mín: - °C / Máx: - °C`;
    }
  });
}



document.getElementById("btnLooker").addEventListener("click", () => {
  window.open("https://app.powerbi.com/view?r=eyJrIjoiNGVkMDVlMzYtN2M0My00NDZkLTgxNGEtYjk2NjViYWM0N2Q3IiwidCI6ImFmZWNhMzc2LTNjOGUtNDM1MS1iODMzLTllYWY4YzI2ODMwMCIsImMiOjR9", "_blank");
});