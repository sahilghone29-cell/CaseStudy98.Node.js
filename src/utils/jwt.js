const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a given user payload
 * @param {Object} payload - User data payload (e.g., { id: user._id })
 * @returns {string} JWT token
 */
const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'writespace_secret_key_btech_exam';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token string
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'writespace_secret_key_btech_exam';
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
};
