const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Add a comment to a blog post
 * @route   POST /api/comments
 * @access  Private
 */
const addComment = async (req, res, next) => {
  try {
    const { postId, content } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return sendError(res, 404, 'Post not found');
    }

    const comment = await Comment.create({
      post: postId,
      user: req.user._id,
      content,
    });

    // Update post comments count
    post.commentsCount = (post.commentsCount || 0) + 1;
    await post.save();

    await comment.populate('user', 'name profileImage bio');

    return sendSuccess(res, 201, 'Comment added successfully', { comment });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all comments for a post
 * @route   GET /api/comments/post/:id
 * @access  Public
 */
const getPostComments = async (req, res, next) => {
  try {
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return sendError(res, 404, 'Post not found');
    }

    const comments = await Comment.find({ post: postId })
      .populate('user', 'name profileImage bio')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Comments fetched successfully', comments);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private (Comment Owner only)
 */
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return sendError(res, 404, 'Comment not found');
    }

    // Check ownership
    if (comment.user.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Forbidden: You can only delete your own comments');
    }

    const postId = comment.post;

    await Comment.findByIdAndDelete(req.params.id);

    // Decrement post comments count
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } });

    return sendSuccess(res, 200, 'Comment deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getPostComments,
  deleteComment,
};
