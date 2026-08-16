const express = require('express');

const router = express.Router();

const {
  register,
  verifyEmail,
  resendVerificationEmail,
  login,
  googleAuth,
  forgetPassword,
  resetPassword,
  getMe,
  logout,
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

const {
  registerEmailLimiter,
  forgotPasswordLimiter,
  verifyEmailLimiter,
  resendVerificationEmailLimiter,
} = require('../middleware/rateLimiter');


// Registration → sends verification email
router.post(
  '/register',
  registerEmailLimiter,
  register
);


// OTP verification
router.post(
  '/verify-email',
  verifyEmailLimiter,
  verifyEmail
);
router.post(
  '/resend-verification-email',
  resendVerificationEmailLimiter,
  resendVerificationEmail
);

// Normal login
router.post(
  '/login',
  login
);


// Google login
router.post(
  '/google',
  googleAuth
);


// Forgot password → sends reset email
router.post(
  '/forgot-password',
  forgotPasswordLimiter,
  forgetPassword
);


// Reset password
router.post(
  '/reset-password/:token',
  resetPassword
);


// Current user
router.get(
  '/me',
  protect,
  getMe
);


// Logout
router.post(
  '/logout',
  logout
);


module.exports = router;