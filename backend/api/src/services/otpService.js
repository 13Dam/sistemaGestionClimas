const speakeasy = require('speakeasy');

const generateOTPSecret = () => {
  return speakeasy.generateSecret({ length: 20 });
};

const generateTOTP = (secret) => {
  return speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32'
  });
};

const verifyTOTP = (token, secret) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token,
    window: 1
  });
};

module.exports = {
  generateOTPSecret,
  generateTOTP,
  verifyTOTP
};
