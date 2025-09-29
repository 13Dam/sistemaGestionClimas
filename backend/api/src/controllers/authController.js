// controllers/authController.js
import { OAuth2Client } from 'google-auth-library';
import { generateAccessToken, generateRefreshToken } from '../services/jwtService.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleSignIn(req, res, next) {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Token no proporcionado' });
  }

  try {
    // 1. Verificar token de Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture } = ticket.getPayload();

    // 2. Generar tokens JWT (sin guardar en DB)
   const accessToken = generateAccessToken({ email, role: "user" });
const refreshToken = generateRefreshToken({ email });

    // 3. Responder
    res.status(200).json({
      accessToken,
      refreshToken,
      user: { email, name, picture }
    });

  } catch (error) {
    next(error);
  }
}
