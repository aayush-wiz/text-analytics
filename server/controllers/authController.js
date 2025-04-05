const User = require("../models/User");
const { ApiError } = require("../middleware/errorHandler");
const { success, error } = require("../utils/responseFormatter");
const logger = require("../utils/logger");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, organization } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError("Email already in use", 400));
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      organization,
    });

    // Generate token
    sendTokenResponse(user, 201, res, "User registered successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(new ApiError("Please provide an email and password", 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ApiError("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ApiError("Invalid credentials", 401));
    }

    // Generate token
    sendTokenResponse(user, 200, res, "Login successful");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    success(res, 200, "User data retrieved", user);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update user details
 * @route   PUT /api/auth/updatedetails
 * @access  Private
 */
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      organization: req.body.organization,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    success(res, 200, "User details updated", user);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update password
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new ApiError("Please provide current and new password", 400));
    }

    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return next(new ApiError("Current password is incorrect", 401));
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, "Password updated successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Logout user / clear cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res, next) => {
  try {
    success(res, 200, "Successfully logged out");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update user preferences
 * @route   PUT /api/auth/preferences
 * @access  Private
 */
exports.updatePreferences = async (req, res, next) => {
  try {
    const { preferences } = req.body;

    if (!preferences) {
      return next(new ApiError("Please provide preferences to update", 400));
    }

    const user = await User.findById(req.user.id);

    // Update preferences
    user.preferences = {
      ...user.preferences,
      ...preferences,
    };

    await user.save();

    success(res, 200, "User preferences updated", user.preferences);
  } catch (err) {
    next(err);
  }
};

/**
 * Helper function to get token from model, create cookie and send response
 */
const sendTokenResponse = (user, statusCode, res, message) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Remove password from output
  user.password = undefined;

  success(res, statusCode, message, { user, token });
};
