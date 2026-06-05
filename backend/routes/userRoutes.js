const express = require('express');
const router = express.Router();
const { getLeaderboard, getBookmarks } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/leaderboard', getLeaderboard);
router.get('/bookmarks', protect, getBookmarks);

module.exports = router;
