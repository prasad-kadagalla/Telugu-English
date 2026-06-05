const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getRandomQuiz,
  submitAnswer,
  submitQuizSession,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} = require('../controllers/quizController');
const { protect, authorise, optionalAuth } = require('../middleware/authMiddleware');
const { quizValidators } = require('../middleware/validationMiddleware');

// Public / optional auth
router.get('/', getQuizzes);
router.get('/random', getRandomQuiz);

// Optional auth (logs progress only when logged in)
router.post('/:id/answer', optionalAuth, submitAnswer);
router.post('/session/submit', optionalAuth, submitQuizSession);

// Admin only
router.post('/', protect, authorise('admin'), quizValidators, createQuiz);
router.put('/:id', protect, authorise('admin'), updateQuiz);
router.delete('/:id', protect, authorise('admin'), deleteQuiz);

module.exports = router;
