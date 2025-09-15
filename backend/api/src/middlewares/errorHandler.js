import logger from '../utils/logger.js';

export default function errorHandler(err, req, res, next) {
  //loguea el error
  logger.error(`${err.message} - ${req.method} ${req.originalUrl}`);

  //loguear el stack en modo desarrollo
  if (process.env.NODE_ENV !== 'production') {
    logger.error(err.stack);
  }

  //respuesta al cliente
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      //solo en dev
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
}
