const log = (level, msg, meta) => {
  const ts = new Date().toISOString();
  if (meta) console.log(`[${ts}] [${level}] ${msg}`, JSON.stringify(meta));
  else console.log(`[${ts}] [${level}] ${msg}`);
};
export default {
  info: (m, meta) => log("INFO", m, meta),
  warn: (m, meta) => log("WARN", m, meta),
  error: (m, meta) => log("ERROR", m, meta)
};
