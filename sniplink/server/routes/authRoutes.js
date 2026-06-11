const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  signup,
  login,
  refresh,
  getMe,
  updateProfile,
  changePassword,
  signupValidation,
  loginValidation,
} = require('../controllers/authController');

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/refresh', refresh);
router.get('/me', authMiddleware, getMe);
router.patch('/profile', authMiddleware, updateProfile);
router.patch('/password', authMiddleware, changePassword);

module.exports = router;
