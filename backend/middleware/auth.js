const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  // Check standard Authorization header first
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // If no header token, fallback to cookie (useful when token is httpOnly cookie)
  if (!token && req.headers.cookie) {
    try {
      const cookieHeader = req.headers.cookie;
      const match = cookieHeader.split(';').map(c => c.trim()).find(c => c.startsWith('cwb_token='));
      if (match) {
        token = decodeURIComponent(match.split('=')[1]);
      }
    } catch (_) { /* ignore cookie parse errors */ }
  }

  if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ success: false, message: 'Not authorized as admin' });
};

module.exports = { protect, admin };
