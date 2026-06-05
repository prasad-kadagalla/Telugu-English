const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/responseUtils');

/**
 * Run validation result check – must be placed after validator chains.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(
      res,
      'Validation failed',
      400,
      errors.array().map((e) => ({ field: e.path, message: e.msg }))
    );
  }
  next();
};

// ─── Auth validators ──────────────────────────────────────────────────────────
const registerValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('school').optional().trim(),
  body('class')
    .optional()
    .isIn(['5th', '6th', '7th', '8th', '9th', '10th', '']).withMessage('Invalid class'),
  validate,
];

const loginValidators = [
  body('email')
    .trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// ─── Lesson validators ────────────────────────────────────────────────────────
const lessonValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['grammar', 'pronunciation', 'vocabulary', 'tenses', 'sentences', 'articles'])
    .withMessage('Invalid category'),
  body('content.definition').notEmpty().withMessage('Definition is required'),
  validate,
];

// ─── Quiz validators ──────────────────────────────────────────────────────────
const quizValidators = [
  body('question').trim().notEmpty().withMessage('Question is required'),
  body('options').isArray({ min: 2 }).withMessage('At least 2 options required'),
  body('correctAnswer').isInt({ min: 0 }).withMessage('Correct answer index required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['grammar', 'vocabulary', 'tenses', 'articles', 'pronunciation', 'general']),
  validate,
];

module.exports = {
  validate,
  registerValidators,
  loginValidators,
  lessonValidators,
  quizValidators,
};
