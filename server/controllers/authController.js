import User from '../models/User.js';
import Creator from '../models/Creator.js';
import Brand from '../models/Brand.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error('Please fill in all fields');
    }

    if (!['creator', 'brand'].includes(role)) {
      res.status(400);
      throw new Error('Invalid account role choice');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with that email');
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    if (user) {
      // Create empty profiles
      if (role === 'creator') {
        await Creator.create({ userId: user._id });
      } else {
        await Brand.create({
          userId: user._id,
          companyName: name // default company name to user's name
        });
      }

      // Generate verification token and print to console
      const verificationToken = user.getEmailVerificationToken();
      await user.save({ validateBeforeSave: false });

      const verifyUrl = `http://localhost:5173/verify/${verificationToken}`;
      console.log(`\n=== EMAIL VERIFICATION LINK ===\n${verifyUrl}\n===============================\n`);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        token: generateToken(user._id, false)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data provided');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      language: user.language,
      themePreference: user.themePreference,
      privacySettings: user.privacySettings,
      notificationSettings: user.notificationSettings,
      token: generateToken(user._id, rememberMe)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error('Please provide an email address');
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('No user found with that email address');
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Log the reset URL to console
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    console.log(`\n=== PASSWORD RESET URL ===\n${resetUrl}\n==========================\n`);

    res.json({ message: 'Password reset link sent! Please check the server console.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      res.status(400);
      throw new Error('Please provide a password of at least 6 characters');
    }

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired password reset token');
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Email
// @route   GET /api/auth/verify/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired verification token');
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile settings
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.profileImage = req.body.profileImage || user.profileImage;
      
      // Save global settings
      user.language = req.body.language || user.language;
      user.themePreference = req.body.themePreference || user.themePreference;
      if (req.body.privacySettings) {
        user.privacySettings = {
          profilePublic: req.body.privacySettings.profilePublic !== undefined 
            ? req.body.privacySettings.profilePublic 
            : user.privacySettings.profilePublic
        };
      }
      if (req.body.notificationSettings) {
        user.notificationSettings = {
          emailAlerts: req.body.notificationSettings.emailAlerts !== undefined 
            ? req.body.notificationSettings.emailAlerts 
            : user.notificationSettings.emailAlerts,
          inAppAlerts: req.body.notificationSettings.inAppAlerts !== undefined 
            ? req.body.notificationSettings.inAppAlerts 
            : user.notificationSettings.inAppAlerts
        };
      }

      if (user.role === 'creator') {
        if (req.body.creatorDetails) {
          user.creatorDetails = {
            niche: req.body.creatorDetails.niche || user.creatorDetails.niche,
            bio: req.body.creatorDetails.bio || user.creatorDetails.bio,
            portfolioUrl: req.body.creatorDetails.portfolioUrl || user.creatorDetails.portfolioUrl,
            socialChannels: req.body.creatorDetails.socialChannels || user.creatorDetails.socialChannels
          };
        }
      } else if (user.role === 'brand') {
        if (req.body.brandDetails) {
          user.brandDetails = {
            companyName: req.body.brandDetails.companyName || user.brandDetails.companyName,
            industry: req.body.brandDetails.industry || user.brandDetails.industry,
            website: req.body.brandDetails.website || user.brandDetails.website,
            description: req.body.brandDetails.description || user.brandDetails.description
          };
        }
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        language: updatedUser.language,
        themePreference: updatedUser.themePreference,
        privacySettings: updatedUser.privacySettings,
        notificationSettings: updatedUser.notificationSettings,
        creatorDetails: updatedUser.creatorDetails,
        brandDetails: updatedUser.brandDetails,
        token: generateToken(updatedUser._id, true)
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUserAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Suspend matching Profiles
    if (user.role === 'creator') {
      await Creator.deleteOne({ userId: user._id });
    } else if (user.role === 'brand') {
      await Brand.deleteOne({ userId: user._id });
    }

    await user.deleteOne();
    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        language: user.language,
        themePreference: user.themePreference,
        privacySettings: user.privacySettings,
        notificationSettings: user.notificationSettings
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
