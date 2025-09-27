import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const router = express.Router();

// login simple para SPA
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // TODO: reemplazar con DB real o validación segura
  if (username === 'admin' && password === '1234') {
    const token = jwt.sign({ username }, config.JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Credenciales inválidas' });
});

export default router;
