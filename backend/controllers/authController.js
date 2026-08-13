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
    // Set cookies server-side so Next.js Edge middleware and SSR always see auth info in production.
    const maxAgeMs = 1000 * 60 * 60 * 24 * 30; // 30 days in ms
    // Decide SameSite and secure based on whether request is same-origin as configured CLIENT_URL.
    const requestOrigin = req.get('origin') || '';
    const clientOrigin = process.env.CLIENT_URL || '';
    const isSameOrigin = clientOrigin && requestOrigin && clientOrigin === requestOrigin;
    // Determine secure by checking if request was via HTTPS (trust proxy must be enabled in production)
    const isSecure = req.secure || (req.headers['x-forwarded-proto'] === 'https') || process.env.NODE_ENV === 'production';

    const cookieOptions = {
      maxAge: maxAgeMs,
      sameSite: isSameOrigin ? 'lax' : 'none',
      secure: isSecure,
      path: '/',
    };

    // Log attempt to set cookies (non-sensitive): helps debug production where cookies are rejected by browser.
    console.log('[Auth] Setting cookies for user', user._id, 'requestOrigin:', requestOrigin, 'clientOrigin:', clientOrigin, 'isSameOrigin:', isSameOrigin, 'cookieOptions:', { sameSite: cookieOptions.sameSite, secure: cookieOptions.secure });

    // Token cookie should be httpOnly for security so JS cannot read it, but middleware will still see it.
    res.cookie('cwb_token', token, { ...cookieOptions, httpOnly: true });
    // User cookie contains non-sensitive public user info used by middleware (role) — keep it accessible to server and client.
    const safeUser = { ...user.toObject(), password: undefined };
    res.cookie('cwb_user', encodeURIComponent(JSON.stringify(safeUser)), { ...cookieOptions, httpOnly: false });

    // Also ensure CORS credentials header present (cors middleware should do this) — set for extra safety.
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.status(201).json({ success: true, user: safeUser, cookieAttempted: true });
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
    const requestOrigin = req.get('origin') || '';
    const clientOrigin = process.env.CLIENT_URL || '';
    const isSameOrigin = clientOrigin && requestOrigin && clientOrigin === requestOrigin;
    const isSecure = req.secure || (req.headers['x-forwarded-proto'] === 'https') || process.env.NODE_ENV === 'production';

    const cookieOptions = {
      maxAge: maxAgeMs,
      sameSite: isSameOrigin ? 'lax' : 'none',
      secure: isSecure,
      path: '/',
    };
    console.log('[Auth] Setting login cookies for user', user._id, 'requestOrigin:', requestOrigin, 'clientOrigin:', clientOrigin, 'isSameOrigin:', isSameOrigin, 'cookieOptions:', { sameSite: cookieOptions.sameSite, secure: cookieOptions.secure });
    res.cookie('cwb_token', token, { ...cookieOptions, httpOnly: true });
    const safeUser = { ...user.toObject(), password: undefined };
    res.cookie('cwb_user', encodeURIComponent(JSON.stringify(safeUser)), { ...cookieOptions, httpOnly: false });

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.json({ success: true, user: safeUser, cookieAttempted: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @desc    Logout user (clear auth cookies)
// @route   POST /api/auth/logout
const logout = async (req, res) => {
  try {
    // Clear cookies set by server
    res.clearCookie('cwb_token', { path: '/' });
    res.clearCookie('cwb_user', { path: '/' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getMe, logout };
