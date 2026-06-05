const express = require('express');
const router = express.Router();
const {
  register,
  login,
  adminLogin,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidators, loginValidators } = require('../middleware/validationMiddleware');

// Public
router.post('/register', registerValidators, register);
router.post('/login', loginValidators, login);
router.post('/admin/login', loginValidators, adminLogin);

// Protected
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
