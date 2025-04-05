const logger = require("../utils/logger");

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`${error.message}`, {
    errorStack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
  });

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ApiError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered for ${field}. Please use another value`;
    error = new ApiError(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(message.join(", "), 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new ApiError("Invalid token", 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new ApiError("Token expired", 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    details: error.details || null,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
module.exports.ApiError = ApiError;
