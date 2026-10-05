const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

/**
 * Express middleware to validate request inputs using express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorArray = errors.array();
    return sendError(res, 400, errorArray[0].msg, errorArray);
  }
  next();
};

module.exports = { validate };
