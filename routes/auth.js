// const express = require('express');
// const { body } = require('express-validator');
// const { register, login, getMe, updateSettings } = require('../controllers/authController');
// const { protect } = require('../middleware/auth');

// const router = express.Router();

// router.post('/register', [
//   body('name').trim().notEmpty().withMessage('Name is required'),
//   body('email').isEmail().withMessage('Valid email is required'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
// ], register);

// router.post('/login', [
//   body('email').isEmail().withMessage('Valid email is required'),
//   body('password').notEmpty().withMessage('Password is required'),
// ], login);

// router.get('/me', protect, getMe);
// router.put('/settings', protect, updateSettings);

// const { protect, isAdmin } = require('../middleware/auth');

// router.get('/users/count', protect, isAdmin, async (req, res) => {
//   const count = await User.countDocuments();
//   res.json({ success: true, count });
// });

// module.exports = router;


const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, updateSettings } = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], login);

router.get('/me', protect, getMe);
router.put('/settings', protect, updateSettings);

router.get('/users/count', protect, isAdmin, async (req, res) => {
  const total = await User.countDocuments();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const active = await User.countDocuments({ lastLoginAt: { $gte: sevenDaysAgo } });
  res.json({ success: true, count: total, activeCount: active });
});

router.get('/users', protect, isAdmin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ success: true, users });
});

module.exports = router;