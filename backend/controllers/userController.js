const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseUtils');

// ─── Get leaderboard (public) ─────────────────────────────────────────────────
exports.getLeaderboard = async (req, res, next) => {
  try {
    const top = await User.find({ role: 'student', isActive: true })
      .select('name school class totalPoints streak badges')
      .sort({ totalPoints: -1 })
      .limit(20);
    return sendSuccess(res, { leaderboard: top }, 'Leaderboard fetched.');
  } catch (err) {
    next(err);
  }
};

// ─── Get user bookmarks ───────────────────────────────────────────────────────
exports.getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks', 'title category slug estimatedTime');
    return sendSuccess(res, { bookmarks: user.bookmarks }, 'Bookmarks fetched.');
  } catch (err) {
    next(err);
  }
};
