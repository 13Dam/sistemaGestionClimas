import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export default function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'No se proporcionó token' });
  }

  const token = authHeader.split(' ')[1]; // formato: "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'Token mal formado' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded; // info del usuario para usar si querés
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
}
