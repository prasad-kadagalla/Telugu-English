const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: () => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
      },
    },
    // Lessons
    lessonsCompleted: [
      {
        lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        completedAt: { type: Date, default: Date.now },
        timeSpent: { type: Number, default: 0 }, // seconds
      },
    ],
    // Quizzes
    quizAttempts: [
      {
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
        selectedAnswer: Number,
        isCorrect: Boolean,
        timeTaken: Number, // seconds
        attemptedAt: { type: Date, default: Date.now },
      },
    ],
    // Pronunciation
    pronunciationSessions: [
      {
        word: String,
        accuracy: Number,
        feedback: String,
        practicedAt: { type: Date, default: Date.now },
      },
    ],
    // Daily summary stats
    dailyStats: {
      lessonsCount: { type: Number, default: 0 },
      quizzesCount: { type: Number, default: 0 },
      quizScore: { type: Number, default: 0 },    // percentage
      pronunciationCount: { type: Number, default: 0 },
      pronunciationAvg: { type: Number, default: 0 },
      pointsEarned: { type: Number, default: 0 },
      timeSpent: { type: Number, default: 0 },    // seconds
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// ─── Compound index: one record per user per day ──────────────────────────────
progressSchema.index({ user: 1, date: 1 }, { unique: true });

// ─── Static: get or create today's progress for a user ───────────────────────
progressSchema.statics.getOrCreateToday = async function (userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let progress = await this.findOne({ user: userId, date: today });
  if (!progress) {
    progress = await this.create({ user: userId, date: today });
  }
  return progress;
};

// ─── Static: get weekly summary for a user ───────────────────────────────────
progressSchema.statics.getWeeklySummary = async function (userId) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  return this.find({
    user: userId,
    date: { $gte: sevenDaysAgo },
  }).sort({ date: 1 });
};

module.exports = mongoose.model('Progress', progressSchema);
