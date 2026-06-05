const { verifyToken } = require('../utils/tokenUtils');
const User = require('../models/User');
const { sendError } = require('../utils/responseUtils');

/**
 * Protect routes – verify JWT and attach user to req.user.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 'Not authorised. No token provided.', 401);
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendError(res, 'User not found. Token is no longer valid.', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Your account has been deactivated.', 403);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid token.', 401);
    }
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Token expired. Please login again.', 401);
    }
    next(err);
  }
};

/**
 * Role-based access guard. Use after protect middleware.
 * Example: authorise('admin')
 */
const authorise = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Role '${req.user.role}' is not authorised to access this resource.`,
        403
      );
    }
    next();
  };
};

/**
 * Optional auth – attaches user if token present, continues either way.
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = verifyToken(token);
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch (_) {
    // ignore – optional
  }
  next();
};

module.exports = { protect, authorise, optionalAuth };
