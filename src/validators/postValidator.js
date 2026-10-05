const { body } = require('express-validator');

const createPostValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Post title is required'),
  body('content')
    .notEmpty()
    .withMessage('Post content is required'),
  body('category')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either "draft" or "published"'),
];

const updatePostValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Post title cannot be empty'),
  body('content')
    .optional()
    .notEmpty()
    .withMessage('Post content cannot be empty'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either "draft" or "published"'),
];

module.exports = {
  createPostValidator,
  updatePostValidator,
};
