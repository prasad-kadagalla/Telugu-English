const Vocabulary = require('../models/Vocabulary');
const Progress = require('../models/Progress');
const { sendSuccess, sendError, sendPaginated } = require('../utils/responseUtils');

// ─── Get vocabulary list ──────────────────────────────────────────────────────
exports.getVocabulary = async (req, res, next) => {
  try {
    const { category, difficulty, search, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { word: { $regex: search, $options: 'i' } },
        { meaning: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Vocabulary.countDocuments(filter);
    const words = await Vocabulary.find(filter)
      .select('-learnedBy -createdBy')
      .sort({ difficulty: 1, word: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendPaginated(res, words, total, page, limit, 'Vocabulary fetched.');
  } catch (err) {
    next(err);
  }
};

// ─── Get daily words (5 random) ───────────────────────────────────────────────
exports.getDailyWords = async (req, res, next) => {
  try {
    const words = await Vocabulary.aggregate([
      { $match: { isActive: true, difficulty: 'easy' } },
      { $sample: { size: 5 } },
    ]);
    return sendSuccess(res, { words }, "Today's 5 vocabulary words.");
  } catch (err) {
    next(err);
  }
};

// ─── Mark word as learned ─────────────────────────────────────────────────────
exports.markLearned = async (req, res, next) => {
  try {
    const word = await Vocabulary.findById(req.params.id);
    if (!word) return sendError(res, 'Word not found.', 404);

    await Vocabulary.findByIdAndUpdate(word._id, {
      $addToSet: { learnedBy: req.user._id },
    });

    const progress = await Progress.getOrCreateToday(req.user._id);
    progress.dailyStats.pointsEarned += 2;
    await progress.save();

    await require('../models/User').findByIdAndUpdate(req.user._id, {
      $inc: { totalPoints: 2 },
    });

    return sendSuccess(res, {}, 'Word marked as learned. +2 points!');
  } catch (err) {
    next(err);
  }
};

// ─── Admin: Create word ───────────────────────────────────────────────────────
exports.createWord = async (req, res, next) => {
  try {
    const word = await Vocabulary.create({ ...req.body, createdBy: req.user._id });
    return sendSuccess(res, { word }, 'Word added to vocabulary.', 201);
  } catch (err) {
    next(err);
  }
};

// ─── Admin: Update word ───────────────────────────────────────────────────────
exports.updateWord = async (req, res, next) => {
  try {
    const word = await Vocabulary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!word) return sendError(res, 'Word not found.', 404);
    return sendSuccess(res, { word }, 'Word updated.');
  } catch (err) {
    next(err);
  }
};

// ─── Admin: Delete word ───────────────────────────────────────────────────────
exports.deleteWord = async (req, res, next) => {
  try {
    const word = await Vocabulary.findByIdAndDelete(req.params.id);
    if (!word) return sendError(res, 'Word not found.', 404);
    return sendSuccess(res, {}, 'Word deleted.');
  } catch (err) {
    next(err);
  }
};
