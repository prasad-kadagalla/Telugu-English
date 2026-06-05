const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: [true, 'Word is required'],
      trim: true,
      unique: true,
    },
    meaning: {
      type: String,
      required: [true, 'Telugu meaning is required'],
      trim: true,
    },
    phonetic: {
      type: String,
      default: '',
    },
    pronunciation: {
      type: String, // simplified phonetic for students: "skuul"
      default: '',
    },
    exampleSentence: {
      type: String,
      default: '',
    },
    exampleTelugu: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['common', 'nature', 'school', 'family', 'food', 'animals', 'places', 'actions', 'feelings'],
      default: 'common',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    synonyms: [String],
    antonyms: [String],
    imageUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    learnedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
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

vocabularySchema.index({ category: 1, difficulty: 1 });

module.exports = mongoose.model('Vocabulary', vocabularySchema);
