// routes/authRoutes.js
import express from 'express';
import { googleSignIn } from '../controllers/authController.js';

const router = express.Router();

// Ruta para el inicio de sesión con Google
router.post('/google', googleSignIn);

export default router;
