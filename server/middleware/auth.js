const jwt = require("jsonwebtoken");
const { ApiError } = require("./errorHandler");
const User = require("../models/User");
const config = require("../config/config");

/**
 * Protect routes - Verify user is authenticated
 */
exports.protect = async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    return next(new ApiError("Not authorized to access this route", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Get user from the token
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return next(new ApiError("User not found", 404));
    }

    next();
  } catch (err) {
    return next(new ApiError("Not authorized to access this route", 401));
  }
};

/**
 * Grant access to specific roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError("User not found", 404));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

/**
 * Check if user owns resource or is admin
 */
exports.checkOwnership = (model) => async (req, res, next) => {
  try {
    const resource = await model.findById(req.params.id);

    if (!resource) {
      return next(
        new ApiError(`Resource not found with id ${req.params.id}`, 404)
      );
    }

    // Check if user owns the resource or is an admin
    if (resource.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ApiError("Not authorized to perform this action", 403));
    }

    // Attach resource to request object
    req.resource = resource;
    next();
  } catch (err) {
    next(err);
  }
};
