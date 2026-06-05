const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for a user.
 * @param {string} id - MongoDB user _id
 * @param {string} role - user role ('student' | 'admin')
 * @returns {string} signed JWT
 */
const generateToken = (id, role = 'student') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

/**
 * Verify a JWT token.
 * @param {string} token
 * @returns {object} decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
