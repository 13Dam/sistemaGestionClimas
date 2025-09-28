const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User'); // Asegúrate que la ruta al modelo es correcta
const jwtService = require('../services/jwtService');

// Inicializa el cliente de Google con el ID de cliente desde las variables de entorno
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleSignIn = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Token no proporcionado' });
  }

  try {
    // 1. Verificar el token de Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture } = ticket.getPayload();

    // 2. Buscar o crear el usuario en MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      // Si el usuario no existe, lo creamos (sin contraseña)
      user = new User({
        email,
        name, // Asumo que tu modelo User tiene un campo 'name'
        // picture, // Podrías guardar la foto de perfil si tu modelo lo permite
        role: 'user', // Asigna un rol por defecto
      });
      await user.save();
    }

    // 3. Generar tokens de sesión con jwtService
    const accessToken = jwtService.generateAccessToken(user);
    const refreshToken = jwtService.generateRefreshToken(user);

    // Opcional: Guardar el refresh token en la base de datos para invalidarlo si es necesario
    // user.refreshToken = refreshToken;
    // await user.save();

    // 4. Enviar los tokens al cliente
    res.status(200).json({ accessToken, refreshToken });

  } catch (error) {
    // Pasamos el error al middleware de manejo de errores
    next(error);
  }
};

module.exports = {
  googleSignIn,
  // ...otros exports que puedas tener
};