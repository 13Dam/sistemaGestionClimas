function logInfo(message) {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
}

function logError(message) {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
}

function logDebug(message) {
  if (process.env.DEBUG === "true") {
    console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
  }
}

export { logInfo, logError, logDebug };
