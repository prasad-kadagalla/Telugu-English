const express = require('express');
const router = express.Router();
const {
  getLessons,
  getLesson,
  completeLesson,
  toggleBookmark,
  createLesson,
  updateLesson,
  deleteLesson,
} = require('../controllers/lessonController');
const { protect, authorise } = require('../middleware/authMiddleware');
const { lessonValidators } = require('../middleware/validationMiddleware');

// Public
router.get('/', getLessons);
router.get('/:id', getLesson);

// Authenticated students
router.post('/:id/complete', protect, completeLesson);
router.post('/:id/bookmark', protect, toggleBookmark);

// Admin only
router.post('/', protect, authorise('admin'), lessonValidators, createLesson);
router.put('/:id', protect, authorise('admin'), updateLesson);
router.delete('/:id', protect, authorise('admin'), deleteLesson);

module.exports = router;
