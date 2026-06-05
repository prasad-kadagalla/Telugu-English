const express = require('express');
const router = express.Router();
const {
  getStats,
  getStudents,
  getStudentDetail,
  toggleUserStatus,
  getLeaderboard,
} = require('../controllers/adminController');
const { protect, authorise } = require('../middleware/authMiddleware');

// All admin routes require authentication + admin role
router.use(protect, authorise('admin'));

router.get('/stats', getStats);
router.get('/students', getStudents);
router.get('/students/:id', getStudentDetail);
router.put('/students/:id/toggle-status', toggleUserStatus);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
