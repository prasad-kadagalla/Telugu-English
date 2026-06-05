const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { sendSuccess, sendError, sendPaginated } = require('../utils/responseUtils');

// ─── Get quizzes (public) ─────────────────────────────────────────────────────
exports.getQuizzes = async (req, res, next) => {
  try {
    const { category, difficulty, type, limit = 10, page = 1 } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (type) filter.type = type;

    const total = await Quiz.countDocuments(filter);
    const quizzes = await Quiz.find(filter)
      .select('-correctAnswer -explanation') // hide answers for quiz mode
      .sort({ category: 1, difficulty: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendPaginated(res, quizzes, total, page, limit, 'Quizzes fetched.');
  } catch (err) {
    next(err);
  }
};

// ─── Get random quiz set ──────────────────────────────────────────────────────
exports.getRandomQuiz = async (req, res, next) => {
  try {
    const { category, count = 10 } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;

    const quizzes = await Quiz.aggregate([
      { $match: filter },
      { $sample: { size: Number(count) } },
      { $project: { correctAnswer: 0, explanation: 0 } },
    ]);

    return sendSuccess(res, { quizzes, total: quizzes.length }, 'Random quiz set ready!');
  } catch (err) {
    next(err);
  }
};

// ─── Submit quiz answer ───────────────────────────────────────────────────────
exports.submitAnswer = async (req, res, next) => {
  try {
    const { selectedAnswer, timeTaken = 0 } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return sendError(res, 'Quiz question not found.', 404);

    const isCorrect = selectedAnswer === quiz.correctAnswer;

    // Update quiz stats
    await Quiz.findByIdAndUpdate(quiz._id, {
      $inc: {
        timesAnswered: 1,
        ...(isCorrect && { timesCorrect: 1 }),
      },
    });

    // Update user progress (only if logged in)
    if (req.user) {
      const progress = await Progress.getOrCreateToday(req.user._id);
      progress.quizAttempts.push({
        quiz: quiz._id,
        selectedAnswer,
        isCorrect,
        timeTaken,
      });
      progress.dailyStats.quizzesCount += 1;

      // Recalculate quiz score for today
      const correct = progress.quizAttempts.filter((a) => a.isCorrect).length;
      progress.dailyStats.quizScore = Math.round(
        (correct / progress.quizAttempts.length) * 100
      );

      if (isCorrect) {
        const pts = quiz.points || 10;
        progress.dailyStats.pointsEarned += pts;
        await User.findByIdAndUpdate(req.user._id, { $inc: { totalPoints: pts } });
      }

      await progress.save();
    }

    return sendSuccess(res, {
      isCorrect,
      correctAnswer: quiz.correctAnswer,
      correctOption: quiz.options[quiz.correctAnswer],
      explanation: quiz.explanation,
      explanationTelugu: quiz.explanationTelugu,
      pointsEarned: isCorrect ? quiz.points : 0,
    }, isCorrect ? '✅ Correct answer!' : '❌ Wrong answer. Try again!');
  } catch (err) {
    next(err);
  }
};

// ─── Submit full quiz session ─────────────────────────────────────────────────
exports.submitQuizSession = async (req, res, next) => {
  try {
    const { answers } = req.body;
    // answers: [{ quizId, selectedAnswer, timeTaken }]

    if (!Array.isArray(answers) || answers.length === 0) {
      return sendError(res, 'Answers array is required.', 400);
    }

    const quizIds = answers.map((a) => a.quizId);
    const quizzes = await Quiz.find({ _id: { $in: quizIds } });
    const quizMap = Object.fromEntries(quizzes.map((q) => [q._id.toString(), q]));

    let correctCount = 0;
    let totalPoints = 0;
    const results = answers.map((a) => {
      const quiz = quizMap[a.quizId];
      if (!quiz) return null;
      const isCorrect = a.selectedAnswer === quiz.correctAnswer;
      if (isCorrect) { correctCount++; totalPoints += quiz.points || 10; }
      return {
        quizId: a.quizId,
        isCorrect,
        correctAnswer: quiz.correctAnswer,
        correctOption: quiz.options[quiz.correctAnswer],
        explanation: quiz.explanation,
      };
    }).filter(Boolean);

    const scorePercent = Math.round((correctCount / answers.length) * 100);

    // Award points
    if (req.user && totalPoints > 0) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { totalPoints } });
    }

    // Check badge: 90%+ score
    if (req.user && scorePercent >= 90) {
      const alreadyHas = req.user.badges.some((b) => b.id === 'quiz_star');
      if (!alreadyHas) {
        await User.findByIdAndUpdate(req.user._id, {
          $push: { badges: { id: 'quiz_star', title: 'Quiz Star', icon: '⭐' } },
        });
      }
    }

    return sendSuccess(res, {
      score: scorePercent,
      correct: correctCount,
      total: answers.length,
      pointsEarned: totalPoints,
      results,
    }, `Quiz completed! Score: ${scorePercent}%`);
  } catch (err) {
    next(err);
  }
};

// ─── Admin: Create quiz ───────────────────────────────────────────────────────
exports.createQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.create({ ...req.body, createdBy: req.user._id });
    return sendSuccess(res, { quiz }, 'Quiz question created.', 201);
  } catch (err) {
    next(err);
  }
};

// ─── Admin: Update quiz ───────────────────────────────────────────────────────
exports.updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quiz) return sendError(res, 'Quiz not found.', 404);
    return sendSuccess(res, { quiz }, 'Quiz updated.');
  } catch (err) {
    next(err);
  }
};

// ─── Admin: Delete quiz ───────────────────────────────────────────────────────
exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return sendError(res, 'Quiz not found.', 404);
    return sendSuccess(res, {}, 'Quiz deleted.');
  } catch (err) {
    next(err);
  }
};
