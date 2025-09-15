import { logger } from "./logger.js";

function errorHandler(err, req, res, next) {
  // Log del error con stack
  logger.error(err.message, { stack: err.stack, route: req.originalUrl });

  //si la respuesta ya fue enviada, delega al siguiente middleware
  if (res.headersSent) {
    return next(err);
  }

  //responder con un error genérico
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || "Error interno del servidor",
  });
}

export default errorHandler;

