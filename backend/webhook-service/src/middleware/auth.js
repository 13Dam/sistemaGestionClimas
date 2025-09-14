import jwt from "jsonwebtoken";
import config from "../config/index.js";

export function verifyInboundJWT(req, res, next) {
  // Espera Authorization: Bearer <token> enviado por MS2
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ error: "missing_token" });

  try {
    jwt.verify(token, config.INBOUND_JWT_SECRET);
    return next();
  } catch (e) {
    return res.status(401).json({ error: "invalid_token" });
  }
}
