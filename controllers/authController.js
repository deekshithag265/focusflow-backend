// const jwt = require('jsonwebtoken');
// const { validationResult } = require('express-validator');
// const User = require('../models/User');
 
// const generateToken = (id, role) =>
//   jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
 
// // @desc    Register user
// // @route   POST /api/auth/register
// // @access  Public
// // exports.register = async (req, res, next) => {
// //   try {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty())
// //       return res.status(400).json({ success: false, errors: errors.array() });
 
// //     const { name, email, password } = req.body;
// //     const user = await User.create({ name, email, password });
 
// //     res.status(201).json({
// //       success: true,
// //       token: generateToken(user._id, user.role),
// //       user: { id: user._id, name: user.name, email: user.email, role: user.role, settings: user.settings },
// //     });
// //   } catch (err) {
// //     next(err);
// //   }
// // };

// exports.register = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ success: false, errors: errors.array() });

//     const { name, email, password } = req.body;

//     // // ✅ Whitelist check
//     // const allowedEmails = [
//     //   process.env.ADMIN_EMAIL,
//     //   ...( process.env.ALLOWED_EMAILS ? process.env.ALLOWED_EMAILS.split(',').map(e => e.trim()) : [])
//     // ];

//     // if (!allowedEmails.includes(email.toLowerCase())) {
//     //   return res.status(403).json({ success: false, message: "This email is not authorized to register." });
//     // }

//     // ✅ Auto-assign admin role
//     const role = email.toLowerCase() === process.env.ADMIN_EMAIL ? 'admin' : 'user';

//     const user = await User.create({ name, email, password, role });

//     res.status(201).json({
//       success: true,
//       token: generateToken(user._id, user.role),
//       user: { id: user._id, name: user.name, email: user.email, role: user.role, settings: user.settings },
//     });
//   } catch (err) {
//     next(err);
//   }
// };
 
// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// exports.login = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ success: false, errors: errors.array() });
 
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).select('+password');
 
//     if (!user || !(await user.matchPassword(password))) {
//       return res.status(401).json({ success: false, message: 'Invalid email or password' });
//     }
 
//     res.json({
//       success: true,
//       token: generateToken(user._id, user.role),
//       user: { id: user._id, name: user.name, email: user.email, role: user.role, settings: user.settings },
//     });
//   } catch (err) {
//     next(err);
//   }
// };
 
// // @desc    Get current user profile
// // @route   GET /api/auth/me
// // @access  Private
// exports.getMe = async (req, res) => {
//   res.json({ success: true, user: req.user });
// };
 
// // @desc    Update user settings
// // @route   PUT /api/auth/settings
// // @access  Private
// exports.updateSettings = async (req, res, next) => {
//   try {
//     const { focusDuration, shortBreak, longBreak, sessionsBeforeLongBreak } = req.body;
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { settings: { focusDuration, shortBreak, longBreak, sessionsBeforeLongBreak } },
//       { new: true, runValidators: true }
//     );
//     res.json({ success: true, settings: user.settings });
//   } catch (err) {
//     next(err);
//   }
// };

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
 
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
 
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, password } = req.body;

    // ✅ Auto-assign admin role
    const role = email.toLowerCase() === process.env.ADMIN_EMAIL ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      token: generateToken(user._id, user.role),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, settings: user.settings },
    });
  } catch (err) {
    next(err);
  }
};
 
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
 
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
 
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // ✅ Update lastLoginAt
    await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });
 
    res.json({
      success: true,
      token: generateToken(user._id, user.role),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, settings: user.settings },
    });
  } catch (err) {
    next(err);
  }
};
 
// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
 
// @desc    Update user settings
// @route   PUT /api/auth/settings
// @access  Private
exports.updateSettings = async (req, res, next) => {
  try {
    const { focusDuration, shortBreak, longBreak, sessionsBeforeLongBreak } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { settings: { focusDuration, shortBreak, longBreak, sessionsBeforeLongBreak } },
      { new: true, runValidators: true }
    );
    res.json({ success: true, settings: user.settings });
  } catch (err) {
    next(err);
  }
};