import express from 'express';
import config from './config/index.js';
import { connectMongo } from './db/mongo.js';
import temperatureRoutes from './routes/temperature.js';
import errorHandler from './middlewares/errorHandler.js';
import logger from './utils/logger.js';

const app = express();

//middleware para parsear JSON
app.use(express.json());

//middleware de logging de requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

//rutas
app.use('/api', temperatureRoutes);

//middleware de manejo de errores (siempre al final)
app.use(errorHandler);

//conectar a MongoDB y levantar el servidor
(async () => {
  try {
    await connectMongo(`${config.MONGO_URI}/${config.DB_NAME}`);
    app.listen(config.PORT, () => {
      logger.info(`API corriendo en puerto ${config.PORT} | MODO: ${config.MODE}`);
    });
  } catch (err) {
    logger.error('No se pudo iniciar el servidor', err);
    process.exit(1);
  }
})();
