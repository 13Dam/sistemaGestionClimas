# 🌐 Microservicio WebSocket Server
Este microservicio forma parte de la arquitectura de El clima en tu mano.  
Su función principal es **recibir datos de temperatura vía WebSocket desde el generador de clientes**, validarlos y reenviarlos a otros microservicios mediante HTTP POST (Webhook y/o API de base de datos).

---

## 📌 Características principales
- Servidor **WebSocket** que recibe temperaturas en tiempo real.
- Validación de payloads (ciudad, temperatura, unidad, timestamp).
- Reenvío de datos a microservicios REST (Webhook, API).
- Soporte para **múltiples clientes** conectados.
- Logs centralizados para debug y monitoreo.
- Configurable en **modo test** (cada 5s) y **producción** (cada 30min).
- Preparado para ejecución en contenedor Docker.

---

## 📂 Uso
1. Instalar dependencias
npm install

Dependencias usadas:
ws → cliente WebSocket
dotenv → carga de variables de entorno
axios → Cliente HTTP para conectarse con APIs externas
express → Para levantar un servidor HTTP

2. Ejecutar en modo desarrollo
npm run dev

3. Ejecutar en producción
npm start

El servidor quedará escuchando en:
ws://localhost:4000

## Flujo de datos
1-El cliente WS (client-generator) envía un JSON como:

{
  "city": "Shangai",
  "temperature": 23.5,
  "unit": "°C",
  "timestamp": 1693580432
}

2-El WS server recibe el mensaje.

3-Valida el payload (utils/validator.js).

4-Lo normaliza y reenvía por HTTP POST hacia:
-Webhook (WEBHOOK_URL)
-API de base de datos (API_URL)