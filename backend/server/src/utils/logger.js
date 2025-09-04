// src/utils/logger.js
const levels = {
  info: "INFO",
  warn: "WARN",
  error: "ERROR",
};

function log(level, message, meta = null) {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] [${levels[level]}] ${message}`;
  if (meta) {
    console.log(base, JSON.stringify(meta, null, 2));
  } else {
    console.log(base);
  }
}

export default {
  info: (msg, meta) => log("info", msg, meta),
  warn: (msg, meta) => log("warn", msg, meta),
  error: (msg, meta) => log("error", msg, meta),
};
