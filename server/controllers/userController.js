const User = require("../models/User");
const TextDocument = require("../models/TextDocument");
const AnalysisResult = require("../models/AnalysisResult");
const { ApiError } = require("../middleware/errorHandler");
const { success, paginate, error } = require("../utils/responseFormatter");

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getUsers = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Filter query
    let query = {};

    // Search by name or email
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Filter by role
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Count total documents
    const totalDocs = await User.countDocuments(query);

    // Execute query with pagination
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    paginate(res, 200, "Users retrieved successfully", users, {
      page,
      limit,
      totalDocs,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return next(new ApiError(`User not found with id ${req.params.id}`, 404));
    }

    success(res, 200, "User retrieved successfully", user);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create user
 * @route   POST /api/users
 * @access  Private/Admin
 */
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, organization } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError("Email already in use", 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      organization,
    });

    // Remove password from response
    user.password = undefined;

    success(res, 201, "User created successfully", user);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, role, organization, preferences } = req.body;

    // Create update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (organization) updateData.organization = organization;
    if (preferences) updateData.preferences = preferences;

    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ApiError(`User not found with id ${req.params.id}`, 404));
    }

    // If email is being changed, check if new email already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new ApiError("Email already in use", 400));
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    success(res, 200, "User updated successfully", updatedUser);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ApiError(`User not found with id ${req.params.id}`, 404));
    }

    // Remove all user's documents and analysis results
    await TextDocument.deleteMany({ user: req.params.id });
    await AnalysisResult.deleteMany({ user: req.params.id });

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    success(res, 200, "User deleted successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get user stats (documents, analysis)
 * @route   GET /api/users/:id/stats
 * @access  Private/Admin
 */
exports.getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ApiError(`User not found with id ${req.params.id}`, 404));
    }

    // Get document stats
    const documentCount = await TextDocument.countDocuments({
      user: req.params.id,
    });
    const analysisCount = await AnalysisResult.countDocuments({
      user: req.params.id,
    });

    // Get document status breakdown
    const documentStatuses = await TextDocument.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Get analysis type breakdown
    const analysisTypes = await AnalysisResult.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: "$analysisType", count: { $sum: 1 } } },
    ]);

    // Format the stats
    const stats = {
      documentCount,
      analysisCount,
      documentStatuses: documentStatuses.reduce((result, item) => {
        result[item._id] = item.count;
        return result;
      }, {}),
      analysisTypes: analysisTypes.reduce((result, item) => {
        result[item._id] = item.count;
        return result;
      }, {}),
    };

    success(res, 200, "User stats retrieved", stats);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Reset user password (admin function)
 * @route   PUT /api/users/:id/resetpassword
 * @access  Private/Admin
 */
exports.resetUserPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return next(new ApiError("Please provide a new password", 400));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ApiError(`User not found with id ${req.params.id}`, 404));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    success(res, 200, "User password reset successfully");
  } catch (err) {
    next(err);
  }
};
