const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para el inicio de sesión con Google
router.post('/google', authController.googleSignIn);

module.exports = router;