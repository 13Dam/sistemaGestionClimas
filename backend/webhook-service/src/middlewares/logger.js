import chalk from "chalk"; // ES Modules import

//logger básico para info, warn y error
const logger = {
  info: (message, meta = {}) => {
    console.log(
      chalk.blue("[INFO]"),
      new Date().toISOString(),
      message,
      Object.keys(meta).length ? JSON.stringify(meta) : ""
    );
  },

  warn: (message, meta = {}) => {
    console.warn(
      chalk.yellow("[WARN]"),
      new Date().toISOString(),
      message,
      Object.keys(meta).length ? JSON.stringify(meta) : ""
    );
  },

  error: (message, meta = {}) => {
    console.error(
      chalk.red("[ERROR]"),
      new Date().toISOString(),
      message,
      Object.keys(meta).length ? JSON.stringify(meta) : ""
    );
  },
};

//middleware para loguear requests entrantes
function requestLogger(req, res, next) {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
}

export { logger, requestLogger };
