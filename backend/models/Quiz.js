const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    questionTelugu: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['mcq', 'fill_blank', 'true_false'],
      default: 'mcq',
    },
    options: {
      type: [String],
      validate: {
        validator: function (v) {
          if (this.type === 'mcq') return v && v.length >= 2 && v.length <= 5;
          if (this.type === 'true_false') return v && v.length === 2;
          return true;
        },
        message: 'MCQ needs 2–5 options; True/False needs exactly 2.',
      },
    },
    correctAnswer: {
      type: Number, // index of correct option
      required: [true, 'Correct answer index is required'],
    },
    explanation: {
      type: String,
      default: '',
    },
    explanationTelugu: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: ['grammar', 'vocabulary', 'tenses', 'articles', 'pronunciation', 'general'],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    points: {
      type: Number,
      default: 10,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    timesAnswered: {
      type: Number,
      default: 0,
    },
    timesCorrect: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// ─── Virtual: accuracy rate ───────────────────────────────────────────────────
quizSchema.virtual('accuracyRate').get(function () {
  if (!this.timesAnswered) return 0;
  return Math.round((this.timesCorrect / this.timesAnswered) * 100);
});

quizSchema.index({ category: 1, difficulty: 1 });
quizSchema.index({ isActive: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
