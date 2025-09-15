import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

//formato personalizado
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: "info", // nivel mínimo a loguear
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new winston.transports.Console() // salida a consola
  ]
});

export default logger;
