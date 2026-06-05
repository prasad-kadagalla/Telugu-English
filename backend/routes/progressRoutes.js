const express = require('express');
const router = express.Router();
const {
  getTodayProgress,
  getWeeklyProgress,
  logPronunciation,
  getDashboardSummary,
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

// All progress routes require authentication
router.use(protect);

router.get('/today', getTodayProgress);
router.get('/weekly', getWeeklyProgress);
router.get('/summary', getDashboardSummary);
router.post('/pronunciation', logPronunciation);

module.exports = router;
