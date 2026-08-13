const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT with a safe fallback for the expiresIn option.
// Some environments may have JWT_EXPIRE unset or set to an invalid value
// (causing: "expiresIn should be a number of seconds or string representing a timespan").
// Coerce numeric strings to Number and default to '30d' when missing/invalid.
const generateToken = (id) => {
  const rawExpire = process.env.JWT_EXPIRE;
  let expiresIn;
  if (!rawExpire) {
    expiresIn = '30d'; // default expiry if env var not provided
  } else if (/^\d+$/.test(rawExpire.trim())) {
    // purely numeric string -> treat as seconds (number)
    expiresIn = Number(rawExpire.trim());
  } else {
    // leave as-is (e.g., '7d', '24h', '1h') - jwt.sign accepts strings like '7d'
    expiresIn = rawExpire;
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, batch, branch } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password, batch, branch });
    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = generateToken(user._id);
    res.json({ success: true, token, user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
