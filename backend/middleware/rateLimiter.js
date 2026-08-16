const rateLimit = require('express-rate-limit');

// Registration email limiter
const registerEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 3,

  message: {
    success: false,
    message:
      'Too many registration attempts. Please try again later.',
  },

  standardHeaders: true,
  legacyHeaders: false,
});

// Forgot password email limiter
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 3,

  message: {
    success: false,
    message:
      'Too many password reset requests. Please try again later.',
  },

  standardHeaders: true,
  legacyHeaders: false,
});

// OTP verification limiter
const verifyEmailLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes

  max: 5,

  message: {
    success: false,
    message:
      'Too many verification attempts. Please try again later.',
  },

  standardHeaders: true,
  legacyHeaders: false,
});

// Resend verification email limiter
const resendVerificationEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 3,

  message: {
    success: false,
    message:
      'Too many verification email requests. Please try again later.',
  },

  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  registerEmailLimiter,
  forgotPasswordLimiter,
  verifyEmailLimiter,
  resendVerificationEmailLimiter,
};