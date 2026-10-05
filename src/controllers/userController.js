const User = require('../models/User');
const Follow = require('../models/Follow');
const Post = require('../models/Post');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Follow an author
 * @route   POST /api/users/:id/follow
 * @access  Private
 */
const followUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    // Prevent self-following
    if (targetUserId.toString() === currentUserId.toString()) {
      return sendError(res, 400, 'You cannot follow yourself');
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return sendError(res, 404, 'User to follow not found');
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: targetUserId,
    });

    if (existingFollow) {
      return sendError(res, 400, 'You are already following this author');
    }

    // Create follow record
    await Follow.create({
      follower: currentUserId,
      following: targetUserId,
    });

    // Update counts
    await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: 1 } });

    return sendSuccess(res, 200, `Successfully followed author ${targetUser.name}`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unfollow an author
 * @route   DELETE /api/users/:id/follow
 * @access  Private
 */
const unfollowUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    // Check if follow record exists
    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: targetUserId,
    });

    if (!existingFollow) {
      return sendError(res, 400, 'You are not following this author');
    }

    // Delete follow record
    await Follow.findByIdAndDelete(existingFollow._id);

    // Update counts
    await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: -1 } });
    await User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: -1 } });

    return sendSuccess(res, 200, 'Successfully unfollowed author');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user profile with posts
 * @route   GET /api/users/:id
 * @access  Public
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    const posts = await Post.find({ author: req.params.id, status: 'published' }).sort({
      publishedAt: -1,
    });

    return sendSuccess(res, 200, 'User profile fetched successfully', {
      user,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getUserProfile,
};
