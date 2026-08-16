const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require('../utils/sendEmail');
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
    const {
      name,
      email,
      password,
      batch,
      branch,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      if (!existing.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email is already registered but not verified',
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Generate 6 digit OTP
   const otp = crypto.randomInt(100000, 1000000).toString();

    const user = await User.create({
      name,
      email,
      password,
      batch,
      branch,

      isVerified: false,

      verificationOTP: otp,

      verificationOTPExpire:
        Date.now() + 10 * 60 * 1000,
    });

    // Send email using Resend → Mailjet fallback
    const emailResult = await sendVerificationEmail(
      email,
      name,
      otp
    );

    if (!emailResult.success) {
      // Remove user if email couldn't be sent
      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        success: false,
        message:
          'Unable to send verification email. Please try again later.',
      });
    }

    return res.status(201).json({
      success: true,
      message:
        'Verification code sent to your email',
    });

  } catch (err) {
    console.error('Register Error:', err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required',
      });
    }

    const user = await User.findOne({ email })
      .select(
        '+verificationOTP +verificationOTPExpire'
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    if (
      !user.verificationOTP ||
      !user.verificationOTPExpire
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    if (
      user.verificationOTPExpire < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired',
      });
    }

    if (user.verificationOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    // Verification successful
    user.isVerified = true;
    user.verificationOTP = null;
    user.verificationOTPExpire = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });

  } catch (err) {
    console.error('Verify Email Error:', err);

    return res.status(500).json({
      success: false,
      message: 'Email verification failed',
    });
  }
};
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Find the user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email',
      });
    }

    // Don't send another OTP if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Generate a new 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();

    // Update OTP and expiration time
    user.verificationOTP = otp;
    user.verificationOTPExpire =
      Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({
      validateBeforeSave: false,
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(
      user.email,
      user.name,
      otp
    );

    // If email sending fails, invalidate the newly generated OTP
    if (!emailResult.success) {
      user.verificationOTP = null;
      user.verificationOTPExpire = null;

      await user.save({
        validateBeforeSave: false,
      });

      return res.status(500).json({
        success: false,
        message:
          'Unable to send verification email. Please try again later.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'A new verification code has been sent to your email',
    });
  } catch (err) {
    console.error(
      'Resend Verification Email Error:',
      err
    );

    return res.status(500).json({
      success: false,
      message: 'Unable to resend verification email',
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.isVerified) {
  return res.status(403).json({
    success: false,
    message: 'Please verify your email before logging in',
  });
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

const googleAuth = async (req, res) => {
  try {
    const { idToken, branch, batch } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Google ID Token is required' });
    }

    // Verify token with Google's tokeninfo API
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!response.ok) {
      return res.status(400).json({ success: false, message: 'Invalid Google ID Token' });
    }

    const payload = await response.json();

    // Verify client ID (audience) matches
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.error('GOOGLE_CLIENT_ID environment variable is not set on the backend');
      return res.status(500).json({ success: false, message: 'Google Authentication is not configured on the server' });
    }

    if (payload.aud !== googleClientId) {
      return res.status(400).json({ success: false, message: 'Google ID Token audience mismatch' });
    }

    const { email, name, picture, sub: googleId } = payload;

    // Find user by email or by googleId
    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      // User exists, check if they don't have googleId yet (e.g. they registered via email/password previously)
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      // Set verified if not already verified
      if (!user.isVerified) {
        user.isVerified = true;
        updated = true;
      }
      // Update avatar if they don't have one
      if (!user.avatar && picture) {
        user.avatar = picture;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      // User does not exist, create new user
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture || '',
        branch: branch || '',
        batch: batch || '',
        isVerified: true, // Google accounts are pre-verified
      });
    }

    const token = generateToken(user._id);
    const cookieOptions = buildCookieOptions(req);
    const safeUser = { ...user.toObject(), password: undefined };

    res.cookie('cwb_token', token, { ...cookieOptions, httpOnly: true });
    res.cookie('cwb_user', encodeURIComponent(JSON.stringify(safeUser)), { ...cookieOptions, httpOnly: false });

    res.setHeader('Access-Control-Allow-Credentials', 'true');

    return res.status(200).json({ success: true, user: safeUser, cookieAttempted: true });

  } catch (err) {
    console.error('Google Auth Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email });

    /*
     * Don't reveal whether the email exists.
     */
    if (!user) {
      return res.json({
        success: true,
        message:
          'If an account exists with this email, a reset link has been sent',
      });
    }

    /*
     * Google-only account
     */
    if (user.googleId && !user.password) {
      return res.status(400).json({
        success: false,
        message:
          'This account uses Google Sign-In. Please continue with Google.',
      });
    }

    /*
     * Generate secure reset token
     */
    const resetToken = crypto
      .randomBytes(32)
      .toString('hex');

    /*
     * Store HASH of token in database
     */
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    /*
     * Token expires in 15 minutes
     */
    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000;

    await user.save({
      validateBeforeSave: false,
    });

    /*
     * This URL goes to your frontend.
     */
    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const emailResult =
      await sendResetPasswordEmail(
        user.email,
        user.name,
        resetUrl
      );

    if (!emailResult.success) {
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;

      await user.save({
        validateBeforeSave: false,
      });

      return res.status(500).json({
        success: false,
        message:
          'Unable to send reset email. Please try again later.',
      });
    }

    return res.json({
      success: true,
      message:
        'If an account exists with this email, a reset link has been sent',
    });

  } catch (err) {
    console.error(
      'Forgot Password Error:',
      err
    );

    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'New password is required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          'Password must be at least 6 characters',
      });
    }

    /*
     * Hash token from URL
     */
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    /*
     * Find valid reset token
     */
    const user = await User.findOne({
      resetPasswordToken: hashedToken,

      resetPasswordExpire: {
        $gt: Date.now(),
      },
    }).select(
      '+password +resetPasswordToken +resetPasswordExpire'
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid or expired reset link',
      });
    }

    /*
     * Set new password
     */
    user.password = password;

    /*
     * Invalidate token
     */
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    return res.json({
      success: true,
      message:
        'Password reset successfully',
    });

  } catch (err) {
    console.error(
      'Reset Password Error:',
      err
    );

    return res.status(500).json({
      success: false,
      message: 'Password reset failed',
    });
  }
};
module.exports = {
  register,
  verifyEmail,
  login,
  googleAuth,
  forgetPassword,
  resetPassword,
  getMe,
  logout,
  resendVerificationEmail
};