const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const Vocabulary = require('../models/Vocabulary');
const { sendSuccess, sendError } = require('../utils/responseUtils');

// ─── Dashboard overview stats ─────────────────────────────────────────────────
exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalLessons, totalQuizzes, totalVocab] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Lesson.countDocuments({ isPublished: true }),
      Quiz.countDocuments({ isActive: true }),
      Vocabulary.countDocuments({ isActive: true }),
    ]);

    // New users this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newUsersThisWeek = await User.countDocuments({
      role: 'student',
      createdAt: { $gte: weekAgo },
    });

    // Active users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = await Progress.countDocuments({ date: today });

    return sendSuccess(res, {
      stats: {
        totalUsers,
        totalLessons,
        totalQuizzes,
        totalVocab,
        newUsersThisWeek,
        activeToday,
      },
    }, 'Admin stats fetched.');
  } catch (err) {
    next(err);
  }
};

// ─── Get all students ─────────────────────────────────────────────────────────
exports.getStudents = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = { role: 'student' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { school: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const students = await User.find(filter)
      .select('-password -bookmarks')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendSuccess(res, { students, total, page: Number(page) }, 'Students fetched.');
  } catch (err) {
    next(err);
  }
};

// ─── Get student detail ───────────────────────────────────────────────────────
exports.getStudentDetail = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user || user.role !== 'student') return sendError(res, 'Student not found.', 404);

    const progressData = await Progress.find({ user: user._id })
      .sort({ date: -1 })
      .limit(30);

    return sendSuccess(res, { user, progressData }, 'Student detail fetched.');
  } catch (err) {
    next(err);
  }
};

// ─── Toggle user active status ────────────────────────────────────────────────
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found.', 404);
    user.isActive = !user.isActive;
    await user.save();
    return sendSuccess(res, { isActive: user.isActive }, `User ${user.isActive ? 'activated' : 'deactivated'}.`);
  } catch (err) {
    next(err);
  }
};

// ─── Leaderboard ──────────────────────────────────────────────────────────────
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
