const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { uploadImageToStorage } = require('../config/firebase');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Helper to format tags into array
 */
const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
  }
  return [];
};

/**
 * @desc    Get all published posts with pagination
 * @route   GET /api/posts
 * @access  Public
 */
const getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { status: 'published' };

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'name email profileImage bio')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit) || 1;

    return sendSuccess(res, 200, 'Posts fetched successfully', posts, {
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'name email profileImage bio followersCount followingCount'
    );

    if (!post) {
      return sendError(res, 404, 'Post not found');
    }

    return sendSuccess(res, 200, 'Post fetched successfully', { post });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content, category, tags, status } = req.body;

    let coverImageUrl = '';
    if (req.file) {
      coverImageUrl = await uploadImageToStorage(req.file);
    }

    const postStatus = status === 'draft' ? 'draft' : 'published';
    const publishedAt = postStatus === 'published' ? new Date() : null;

    const post = await Post.create({
      title,
      content,
      category: category || 'General',
      tags: parseTags(tags),
      status: postStatus,
      publishedAt,
      coverImage: coverImageUrl,
      author: req.user._id,
    });

    await post.populate('author', 'name email profileImage bio');

    return sendSuccess(res, 201, 'Post created successfully', { post });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update post
 * @route   PUT /api/posts/:id
 * @access  Private (Owner only)
 */
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return sendError(res, 404, 'Post not found');
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Forbidden: You can only edit your own posts');
    }

    const { title, content, category, tags, status, coverImage } = req.body;

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (category !== undefined) post.category = category;
    if (tags !== undefined) post.tags = parseTags(tags);
    if (coverImage !== undefined) post.coverImage = coverImage;

    if (req.file) {
      post.coverImage = await uploadImageToStorage(req.file);
    }

    if (status !== undefined) {
      if (status === 'published' && post.status !== 'published') {
        post.publishedAt = new Date();
      }
      post.status = status;
    }

    await post.save();
    await post.populate('author', 'name email profileImage bio');

    return sendSuccess(res, 200, 'Post updated successfully', { post });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete post
 * @route   DELETE /api/posts/:id
 * @access  Private (Owner only)
 */
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return sendError(res, 404, 'Post not found');
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Forbidden: You can only delete your own posts');
    }

    // Delete post
    await Post.findByIdAndDelete(req.params.id);

    // Delete all associated comments
    await Comment.deleteMany({ post: req.params.id });

    return sendSuccess(res, 200, 'Post deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Publish a draft post
 * @route   POST /api/posts/:id/publish
 * @access  Private (Owner only)
 */
const publishPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return sendError(res, 404, 'Post not found');
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Forbidden: You can only publish your own posts');
    }

    post.status = 'published';
    post.publishedAt = new Date();
    await post.save();

    await post.populate('author', 'name email profileImage bio');

    return sendSuccess(res, 200, 'Post published successfully', { post });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search posts by keyword
 * @route   GET /api/posts/search?keyword=technology
 * @access  Public
 */
const searchPosts = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === '') {
      return sendError(res, 400, 'Search keyword is required');
    }

    const regex = new RegExp(keyword.trim(), 'i');

    const filter = {
      status: 'published',
      $or: [
        { title: regex },
        { content: regex },
        { category: regex },
        { tags: regex },
      ],
    };

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'name email profileImage bio')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit) || 1;

    return sendSuccess(res, 200, `Search results for keyword "${keyword}"`, posts, {
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Like / Unlike a post
 * @route   POST /api/posts/:id/like
 * @access  Private
 */
const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return sendError(res, 404, 'Post not found');
    }

    const userId = req.user._id;
    const isLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    let message = '';
    if (isLiked) {
      // Remove like
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      post.likesCount = Math.max(0, post.likesCount - 1);
      message = 'Post unliked successfully';
    } else {
      // Add like
      post.likes.push(userId);
      post.likesCount = post.likes.length;
      message = 'Post liked successfully';
    }

    await post.save();

    return sendSuccess(res, 200, message, {
      liked: !isLiked,
      likesCount: post.likesCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Draft autosave API (Optional Advanced Feature)
 * @route   PUT /api/posts/:id/draft
 * @access  Private (Owner only)
 */
const saveDraft = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return sendError(res, 404, 'Post not found');
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Forbidden: You can only save draft for your own posts');
    }

    const { title, content, category, tags } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (category !== undefined) post.category = category;
    if (tags !== undefined) post.tags = parseTags(tags);

    post.status = 'draft';
    await post.save();

    return sendSuccess(res, 200, 'Draft saved successfully', { post });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get trending posts based on engagement score (Optional Advanced Feature)
 * @route   GET /api/posts/trending
 * @access  Public
 */
const getTrendingPosts = async (req, res, next) => {
  try {
    // Calculate trending score based on likesCount * 2 + commentsCount * 3
    const posts = await Post.aggregate([
      { $match: { status: 'published' } },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ['$likesCount', 2] },
              { $multiply: ['$commentsCount', 3] },
            ],
          },
        },
      },
      { $sort: { score: -1, createdAt: -1 } },
      { $limit: 10 },
    ]);

    // Populate author
    await Post.populate(posts, {
      path: 'author',
      select: 'name email profileImage bio',
    });

    return sendSuccess(res, 200, 'Trending posts fetched successfully', posts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
