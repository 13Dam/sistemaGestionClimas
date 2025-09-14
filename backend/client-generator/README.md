# 🌡️ Client Generator - Microservicio de Temperaturas
Este microservicio forma parte del sistema *"El clima en tu mano"*.  
Su responsabilidad es **generar mediciones de temperatura periódicas** para distintas ciudades y enviarlas a un servidor WebSocket.


## 🚀 Funcionalidad
- Genera temperaturas en **°C** para una lista configurable de ciudades.
- Formato de salida:
  ```json
  {
    "city": "Shanghai",
    "temperature": 23.4,
    "unit": "°C",
    "timestamp": 1725230987000
  }

Modos de operación:
- Test (MODE=test) → genera valores aleatorios cada pocos segundos.
- Producción (MODE=prod) → obtendrá datos reales desde una API de clima (a definir cuál)

Ejecución
Instalar dependencias:

npm install

Dependencias usadas:
ws → cliente WebSocket
dotenv → carga de variables de entorno
axios → Cliente HTTP para conectarse con APIs externas

Iniciar el microservicio:
node src/index.js

El cliente intentará conectarse al servidor WebSocket definido en WS_SERVER_URL y enviará datos periódicamente.

----

Logs de ejemplo
Ejemplo de datos generados en modo test:

[INFO] 2025-09-01T23:10:12.123Z - 📤 Enviado: {"city":"Shanghai","temperature":19.2,"unit":"°C","timestamp":1725231012123}
[INFO] 2025-09-01T23:10:12.123Z - 📤 Enviado: {"city":"Berlin","temperature":16.7,"unit":"°C","timestamp":1725231012123}
[INFO] 2025-09-01T23:10:12.123Z - 📤 Enviado: {"city":"Rio de Janeiro","temperature":27.4,"unit":"°C","timestamp":1725231012123}
