import express from 'express';
import config from './config/index.js';
import cors from "cors";
import { connectMongo } from './db/mongo.js';
import temperatureRoutes from './routes/temperature.js';
import authRoutes from './routes/auth.js'; // <-- login
import errorHandler from './middlewares/errorHandler.js';
import logger from './utils/logger.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// rutas
app.use('/api', temperatureRoutes);
app.use('/api', authRoutes); // <-- ruta login

app.use(errorHandler);

// conectar a Mongo y levantar servidor
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
