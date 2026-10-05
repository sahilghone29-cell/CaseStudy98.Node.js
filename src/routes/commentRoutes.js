const express = require('express');
const router = express.Router();
const {
  addComment,
  getPostComments,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { createCommentValidator } = require('../validators/commentValidator');
const { validate } = require('../middleware/validationMiddleware');

/**
 * @route   POST /api/comments
 * @desc    Create a new comment on a post
 * @access  Private
 */
router.post('/', protect, createCommentValidator, validate, addComment);

/**
 * @route   GET /api/comments/post/:id
 * @desc    Get all comments for a post
 * @access  Public
 */
router.get('/post/:id', getPostComments);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment
 * @access  Private (Owner only)
 */
router.delete('/:id', protect, deleteComment);

module.exports = router;
