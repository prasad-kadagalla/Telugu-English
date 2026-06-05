const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['grammar', 'pronunciation', 'vocabulary', 'tenses', 'sentences', 'articles'],
    },
    subcategory: {
      type: String,
      default: '',
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    content: {
      definition: { type: String, required: true },
      teluguExplanation: { type: String, default: '' },
      examples: [
        {
          english: String,
          telugu: String,
          sentence: String,
        },
      ],
      practiceQuestions: [String],
      tips: [String],
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    completedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    tags: [String],
    estimatedTime: {
      type: Number, // in minutes
      default: 10,
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

// ─── Virtual: completion count ───────────────────────────────────────────────
lessonSchema.virtual('completionCount').get(function () {
  return this.completedBy ? this.completedBy.length : 0;
});

// ─── Pre-save: generate slug ─────────────────────────────────────────────────
lessonSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 80);
  }
  next();
});

// ─── Indexes ─────────────────────────────────────────────────────────────────
lessonSchema.index({ category: 1, order: 1 });
lessonSchema.index({ isPublished: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
