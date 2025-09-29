import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export default function auth(req, res, next) {
  const serviceToken = req.headers['x-service-token'];
  if (serviceToken && serviceToken === process.env.MS3_SERVICE_TOKEN) {
    return next(); // autorizado por MS3
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No se proporcionó token' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token mal formado' });

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
}
