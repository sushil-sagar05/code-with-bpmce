const User = require('../models/User');
const jwt = require('jsonwebtoken');

const maxAgeMs = 1000 * 60 * 60 * 24 * 30; // 30 days

const generateToken = (id) => {
  const rawExpire = process.env.JWT_EXPIRE;
  let expiresIn;

  if (!rawExpire) {
    expiresIn = '30d';
  } else if (/^\d+$/.test(rawExpire.trim())) {
    expiresIn = Number(rawExpire.trim());
  } else {
    expiresIn = rawExpire;
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

const buildCookieOptions = (req) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    maxAge: maxAgeMs,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    path: '/',
  };

  if (process.env.COOKIE_DOMAIN) {
    cookieOptions.domain = process.env.COOKIE_DOMAIN;
  }

  return cookieOptions;
};

const register = async (req, res) => {
  try {
    const { name, email, password, batch, branch } = req.body;
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, batch, branch });
    const token = generateToken(user._id);

    const cookieOptions = buildCookieOptions(req);
    const safeUser = { ...user.toObject(), password: undefined };

    res.cookie('cwb_token', token, { ...cookieOptions, httpOnly: true });
    res.cookie('cwb_user', encodeURIComponent(JSON.stringify(safeUser)), { ...cookieOptions, httpOnly: false });

    res.setHeader('Access-Control-Allow-Credentials', 'true');

    return res.status(201).json({ success: true, user: safeUser, cookieAttempted: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    const cookieOptions = buildCookieOptions(req);
    const safeUser = { ...user.toObject(), password: undefined };

    res.cookie('cwb_token', token, { ...cookieOptions, httpOnly: true });
    res.cookie('cwb_user', encodeURIComponent(JSON.stringify(safeUser)), { ...cookieOptions, httpOnly: false });

    res.setHeader('Access-Control-Allow-Credentials', 'true');

    return res.json({ success: true, user: safeUser, cookieAttempted: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

const logout = async (req, res) => {
  try {
    res.clearCookie('cwb_token', { path: '/' });
    res.clearCookie('cwb_user', { path: '/' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getMe, logout };