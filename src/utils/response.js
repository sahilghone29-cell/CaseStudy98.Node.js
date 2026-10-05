/**
 * Utility functions for consistent API responses.
 */

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default 200)
 * @param {string} message - Response message
 * @param {Object|Array} [data] - Optional response payload
 * @param {Object} [extra] - Extra fields (e.g. pagination)
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, extra = {}) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (extra && Object.keys(extra).length > 0) {
    Object.assign(response, extra);
  }

  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {string} message - Error message
 * @param {Array} [errors] - Optional detailed validation errors array
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError,
};
