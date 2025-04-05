/**
 * Format successful response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @param {Object} meta - Additional metadata
 */
exports.success = (
  res,
  statusCode = 200,
  message = "Success",
  data = null,
  meta = {}
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

/**
 * Format paginated response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Array} data - Response data array
 * @param {Object} pagination - Pagination information
 */
exports.paginate = (
  res,
  statusCode = 200,
  message = "Success",
  data = [],
  pagination = {}
) => {
  const {
    page = 1,
    limit = 10,
    totalDocs = 0,
    totalPages = Math.ceil(totalDocs / limit),
  } = pagination;

  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalDocs,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

/**
 * Format error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} errors - Validation errors
 */
exports.error = (
  res,
  statusCode = 500,
  message = "Server Error",
  errors = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
