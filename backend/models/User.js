const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never return password in queries
    },
    school: {
      type: String,
      trim: true,
      default: '',
    },
    class: {
      type: String,
      enum: ['5th', '6th', '7th', '8th', '9th', '10th', ''],
      default: '',
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    avatar: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Gamification
    totalPoints: {
      type: Number,
      default: 0,
    },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActive: { type: Date, default: null },
    },
    badges: [
      {
        id: String,
        title: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now },
      },
    ],
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual: full avatar initials ──────────────────────────────────────────
userSchema.virtual('initials').get(function () {
  return this.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

// ─── Pre-save: hash password ─────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance method: compare password ──────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Instance method: update streak ─────────────────────────────────────────
userSchema.methods.updateStreak = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!this.streak.lastActive) {
    this.streak.current = 1;
  } else {
    const last = new Date(this.streak.lastActive);
    last.setHours(0, 0, 0, 0);
    const diff = (today - last) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      this.streak.current += 1;
    } else if (diff > 1) {
      this.streak.current = 1;
    }
    // diff === 0 means same day, no change
  }
  this.streak.lastActive = today;
  if (this.streak.current > this.streak.longest) {
    this.streak.longest = this.streak.current;
  }
};

// ─── Index ───────────────────────────────────────────────────────────────────
userSchema.index({ email: 1 });
userSchema.index({ totalPoints: -1 });

module.exports = mongoose.model('User', userSchema);
