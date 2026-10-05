const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  searchPosts,
  likePost,
  saveDraft,
  getTrendingPosts,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { uploadCoverImage } = require('../middleware/uploadMiddleware');
const { createPostValidator, updatePostValidator } = require('../validators/postValidator');
const { validate } = require('../middleware/validationMiddleware');

/**
 * @route   GET /api/posts/search?keyword=technology
 * @desc    Search posts by keyword
 * @access  Public
 */
router.get('/search', searchPosts);

/**
 * @route   GET /api/posts/trending
 * @desc    Get trending posts based on engagement
 * @access  Public
 */
router.get('/trending', getTrendingPosts);

/**
 * @route   GET /api/posts
 * @desc    Get all published posts with pagination
 * @access  Public
 */
router.get('/', getAllPosts);

/**
 * @route   GET /api/posts/:id
 * @desc    Get single post by ID
 * @access  Public
 */
router.get('/:id', getPostById);

/**
 * @route   POST /api/posts
 * @desc    Create a new blog post (supports cover image file upload)
 * @access  Private
 */
router.post('/', protect, uploadCoverImage, createPostValidator, validate, createPost);

/**
 * @route   PUT /api/posts/:id
 * @desc    Update a blog post
 * @access  Private (Owner only)
 */
router.put('/:id', protect, uploadCoverImage, updatePostValidator, validate, updatePost);

/**
 * @route   PUT /api/posts/:id/draft
 * @desc    Draft autosave API
 * @access  Private (Owner only)
 */
router.put('/:id/draft', protect, saveDraft);

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a blog post
 * @access  Private (Owner only)
 */
router.delete('/:id', protect, deletePost);

/**
 * @route   POST /api/posts/:id/publish
 * @desc    Publish a blog post draft
 * @access  Private (Owner only)
 */
router.post('/:id/publish', protect, publishPost);

/**
 * @route   POST /api/posts/:id/like
 * @desc    Like / unlike a blog post
 * @access  Private
 */
router.post('/:id/like', protect, likePost);

module.exports = router;
