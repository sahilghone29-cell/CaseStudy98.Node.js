const { body } = require('express-validator');

const createCommentValidator = [
  body('postId')
    .notEmpty()
    .withMessage('postId is required')
    .isMongoId()
    .withMessage('Invalid postId format'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required'),
];

module.exports = {
  createCommentValidator,
};
