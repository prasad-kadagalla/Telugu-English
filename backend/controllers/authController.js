const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');
const { sendSuccess, sendError } = require('../utils/responseUtils');

// ─── Register ────────────────────────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, school, class: userClass } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return sendError(res, 'An account with this email already exists.', 400);
    }

    const user = await User.create({ name, email, password, school, class: userClass });
    const token = generateToken(user._id, user.role);

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          school: user.school,
          class: user.class,
          role: user.role,
          totalPoints: user.totalPoints,
          streak: user.streak,
          badges: user.badges,
        },
      },
      'Registration successful! Welcome to Telugu-English Learning Platform.',
      201
    );
  } catch (err) {
    next(err);
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Your account has been deactivated. Contact support.', 403);
    }

    // Update streak
    user.updateStreak();
    await user.save();

    const token = generateToken(user._id, user.role);

    return sendSuccess(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        school: user.school,
        class: user.class,
        role: user.role,
        totalPoints: user.totalPoints,
        streak: user.streak,
        badges: user.badges,
      },
    }, `Welcome back, ${user.name}!`);
  } catch (err) {
    next(err);
  }
};

// ─── Admin Login ─────────────────────────────────────────────────────────────
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!user) {
      return sendError(res, 'Invalid admin credentials.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid admin credentials.', 401);
    }

    const token = generateToken(user._id, user.role);

    return sendSuccess(res, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    }, 'Admin login successful.');
  } catch (err) {
    next(err);
  }
};

// ─── Get current user ────────────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks', 'title category');
    return sendSuccess(res, { user }, 'User profile fetched.');
  } catch (err) {
    next(err);
  }
};

// ─── Update profile ──────────────────────────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, school, class: userClass } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, school, class: userClass },
      { new: true, runValidators: true }
    );
    return sendSuccess(res, { user }, 'Profile updated successfully.');
  } catch (err) {
    next(err);
  }
};

// ─── Change password ─────────────────────────────────────────────────────────
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 'Current password is incorrect.', 400);
    }

    user.password = newPassword;
    await user.save();
    return sendSuccess(res, {}, 'Password changed successfully.');
  } catch (err) {
    next(err);
  }
};
