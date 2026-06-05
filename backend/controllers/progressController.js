const Progress = require('../models/Progress');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseUtils');

// ─── Get today's progress ─────────────────────────────────────────────────────
exports.getTodayProgress = async (req, res, next) => {
  try {
    const progress = await Progress.getOrCreateToday(req.user._id);
    return sendSuccess(res, { progress }, "Today's progress fetched.");
  } catch (err) {
    next(err);
  }
};

// ─── Get weekly progress ──────────────────────────────────────────────────────
exports.getWeeklyProgress = async (req, res, next) => {
  try {
    const weekly = await Progress.getWeeklySummary(req.user._id);
    // Map to chart-friendly format
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = weekly.map((p) => ({
      day: days[new Date(p.date).getDay()],
      date: p.date,
      lessons: p.dailyStats.lessonsCount,
      quizzes: p.dailyStats.quizzesCount,
      quizScore: p.dailyStats.quizScore,
      pronunciation: p.dailyStats.pronunciationCount,
      points: p.dailyStats.pointsEarned,
      timeSpent: Math.round(p.dailyStats.timeSpent / 60), // convert to minutes
    }));

    return sendSuccess(res, { chartData, raw: weekly }, 'Weekly progress fetched.');
  } catch (err) {
    next(err);
  }
};

// ─── Log pronunciation practice ──────────────────────────────────────────────
exports.logPronunciation = async (req, res, next) => {
  try {
    const { word, accuracy, feedback } = req.body;
    if (!word || accuracy == null) {
      return sendError(res, 'Word and accuracy are required.', 400);
    }

    const progress = await Progress.getOrCreateToday(req.user._id);
    progress.pronunciationSessions.push({ word, accuracy, feedback });

    // Update daily avg
    const sessions = progress.pronunciationSessions;
    const avg = Math.round(sessions.reduce((s, p) => s + p.accuracy, 0) / sessions.length);
    progress.dailyStats.pronunciationCount += 1;
    progress.dailyStats.pronunciationAvg = avg;

    if (accuracy >= 80) {
      progress.dailyStats.pointsEarned += 5;
      await User.findByIdAndUpdate(req.user._id, { $inc: { totalPoints: 5 } });
    }

    await progress.save();
    return sendSuccess(res, { accuracy, avg }, 'Pronunciation practice logged. +5 points!');
  } catch (err) {
    next(err);
  }
};

// ─── Get full progress summary for dashboard ─────────────────────────────────
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // All-time totals
    const allProgress = await Progress.find({ user: userId });
    const totalLessons = allProgress.reduce((s, p) => s + p.dailyStats.lessonsCount, 0);
    const totalQuizzes = allProgress.reduce((s, p) => s + p.dailyStats.quizzesCount, 0);
    const allScores = allProgress.filter((p) => p.dailyStats.quizScore > 0).map((p) => p.dailyStats.quizScore);
    const avgScore = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
    const allPron = allProgress.filter((p) => p.dailyStats.pronunciationAvg > 0).map((p) => p.dailyStats.pronunciationAvg);
    const avgPron = allPron.length ? Math.round(allPron.reduce((a, b) => a + b, 0) / allPron.length) : 0;

    const user = await User.findById(userId);

    return sendSuccess(res, {
      summary: {
        totalLessons,
        totalQuizzes,
        avgScore,
        avgPronunciation: avgPron,
        totalPoints: user.totalPoints,
        streak: user.streak,
        badges: user.badges,
        daysActive: allProgress.length,
      },
    }, 'Dashboard summary fetched.');
  } catch (err) {
    next(err);
  }
};
