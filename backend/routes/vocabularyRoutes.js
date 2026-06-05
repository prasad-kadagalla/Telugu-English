const express = require('express');
const router = express.Router();
const {
  getVocabulary,
  getDailyWords,
  markLearned,
  createWord,
  updateWord,
  deleteWord,
} = require('../controllers/vocabularyController');
const { protect, authorise } = require('../middleware/authMiddleware');

// Public
router.get('/', getVocabulary);
router.get('/daily', getDailyWords);

// Authenticated
router.post('/:id/learned', protect, markLearned);

// Admin only
router.post('/', protect, authorise('admin'), createWord);
router.put('/:id', protect, authorise('admin'), updateWord);
router.delete('/:id', protect, authorise('admin'), deleteWord);

module.exports = router;
