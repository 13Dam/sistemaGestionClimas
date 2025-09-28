const bcrypt = require('bcrypt');
const User = require('../models/User');

const registerUser = async ({ email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('El usuario ya existe');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPassword,
    role
  });

  await newUser.save();
  return newUser;
};

const validateLogin = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Usuario no encontrado');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Contraseña incorrecta');

  return user;
};

module.exports = {
  registerUser,
  validateLogin
};
