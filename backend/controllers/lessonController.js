const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const { sendSuccess, sendError, sendPaginated } = require('../utils/responseUtils');

// ─── Get all lessons (public, paginated, filterable) ─────────────────────────
exports.getLessons = async (req, res, next) => {
  try {
    const { category, level, page = 1, limit = 20, search } = req.query;
    const filter = { isPublished: true };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const total = await Lesson.countDocuments(filter);
    const lessons = await Lesson.find(filter)
      .select('-completedBy -createdBy')
      .sort({ order: 1, createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendPaginated(res, lessons, total, page, limit, 'Lessons fetched.');
  } catch (err) {
    next(err);
  }
};

// ─── Get single lesson ────────────────────────────────────────────────────────
exports.getLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
      isPublished: true,
    });

    if (!lesson) return sendError(res, 'Lesson not found.', 404);

    // Increment view count
    await Lesson.findByIdAndUpdate(lesson._id, { $inc: { viewCount: 1 } });

    return sendSuccess(res, { lesson }, 'Lesson fetched.');
  } catch (err) {
    next(err);
  }
};

// ─── Mark lesson complete (authenticated) ────────────────────────────────────
exports.completeLesson = async (req, res, next) => {
  try {
    const { timeSpent = 0 } = req.body;
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return sendError(res, 'Lesson not found.', 404);

    // Add user to completedBy if not already there
    await Lesson.findByIdAndUpdate(lesson._id, {
      $addToSet: { completedBy: req.user._id },
    });

    // Update progress
    const progress = await Progress.getOrCreateToday(req.user._id);
    const alreadyDone = progress.lessonsCompleted.some(
      (l) => l.lesson.toString() === lesson._id.toString()
    );

    if (!alreadyDone) {
      progress.lessonsCompleted.push({ lesson: lesson._id, timeSpent });
      progress.dailyStats.lessonsCount += 1;
      progress.dailyStats.pointsEarned += 20;
      progress.dailyStats.timeSpent += timeSpent;
      await progress.save();

      // Award points to user
      await require('../models/User').findByIdAndUpdate(req.user._id, {
        $inc: { totalPoints: 20 },
      });
    }

    return sendSuccess(res, { alreadyCompleted: alreadyDone }, 'Lesson marked as complete. +20 points!');
  } catch (err) {
    next(err);
  }
};

// ─── Bookmark / unbookmark lesson ────────────────────────────────────────────
exports.toggleBookmark = async (req, res, next) => {
  try {
    const user = req.user;
    const lessonId = req.params.id;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return sendError(res, 'Lesson not found.', 404);

    const isBookmarked = user.bookmarks.includes(lessonId);
    const update = isBookmarked
      ? { $pull: { bookmarks: lessonId } }
      : { $addToSet: { bookmarks: lessonId } };

    await require('../models/User').findByIdAndUpdate(user._id, update);

    return sendSuccess(
      res,
      { bookmarked: !isBookmarked },
      isBookmarked ? 'Bookmark removed.' : 'Lesson bookmarked!'
    );
  } catch (err) {
    next(err);
  }
};

// ─── Admin: Create lesson ─────────────────────────────────────────────────────
exports.createLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.create({ ...req.body, createdBy: req.user._id });
    return sendSuccess(res, { lesson }, 'Lesson created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

// ─── Admin: Update lesson ─────────────────────────────────────────────────────
exports.updateLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lesson) return sendError(res, 'Lesson not found.', 404);
    return sendSuccess(res, { lesson }, 'Lesson updated successfully.');
  } catch (err) {
    next(err);
  }
};

// ─── Admin: Delete lesson ─────────────────────────────────────────────────────
exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) return sendError(res, 'Lesson not found.', 404);
    return sendSuccess(res, {}, 'Lesson deleted successfully.');
  } catch (err) {
    next(err);
  }
};
