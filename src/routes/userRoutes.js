const express = require('express');
const router = express.Router();
const {
  followUser,
  unfollowUser,
  getUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/users/:id
 * @desc    Get user profile and their published posts
 * @access  Public
 */
router.get('/:id', getUserProfile);

/**
 * @route   POST /api/users/:id/follow
 * @desc    Follow an author
 * @access  Private
 */
router.post('/:id/follow', protect, followUser);

/**
 * @route   DELETE /api/users/:id/follow
 * @desc    Unfollow an author
 * @access  Private
 */
router.delete('/:id/follow', protect, unfollowUser);

module.exports = router;
