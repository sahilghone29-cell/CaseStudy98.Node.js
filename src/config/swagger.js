const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WriteSpace - Blogging Platform Backend API',
      version: '1.0.0',
      description:
        'RESTful API backend for WriteSpace blogging platform built with Node.js, Express.js, Local MongoDB, and Firebase.',
      contact: {
        name: 'Sahil Ghone',
        email: 'sahil@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66fa3b1e9c8d7f0012345678' },
            name: { type: 'string', example: 'Sahil Ghone' },
            email: { type: 'string', example: 'sahil@example.com' },
            bio: { type: 'string', example: 'Tech writer and software developer' },
            profileImage: { type: 'string', example: 'https://example.com/avatar.jpg' },
            followersCount: { type: 'number', example: 10 },
            followingCount: { type: 'number', example: 5 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66fa3b1e9c8d7f0087654321' },
            title: { type: 'string', example: 'Introduction to Node.js' },
            content: { type: 'string', example: 'Node.js is an event-driven JavaScript runtime...' },
            category: { type: 'string', example: 'Technology' },
            tags: { type: 'array', items: { type: 'string' }, example: ['nodejs', 'express', 'javascript'] },
            coverImage: { type: 'string', example: 'https://storage.googleapis.com/writespace/cover.jpg' },
            status: { type: 'string', enum: ['draft', 'published'], example: 'published' },
            likesCount: { type: 'number', example: 15 },
            commentsCount: { type: 'number', example: 3 },
            author: { $ref: '#/components/schemas/User' },
            publishedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66fa3b1e9c8d7f0099887766' },
            post: { type: 'string', example: '66fa3b1e9c8d7f0087654321' },
            user: { $ref: '#/components/schemas/User' },
            content: { type: 'string', example: 'Great article! Very insightful.' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed successfully' },
            data: { type: 'object' },
          },
        },
      },
    },
    paths: {
      '/api/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'Sahil Ghone' },
                    email: { type: 'string', example: 'sahil@example.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User registered successfully' },
            400: { description: 'Validation error' },
            409: { description: 'Email already exists' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          summary: 'User login & get JWT token',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'sahil@example.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful' },
            401: { description: 'Invalid email or password' },
          },
        },
      },
      '/api/posts': {
        get: {
          summary: 'Get all published blog posts',
          tags: ['Posts'],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: {
            200: { description: 'Posts list fetched successfully' },
          },
        },
        post: {
          summary: 'Create a new blog post',
          tags: ['Posts'],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'content'],
                  properties: {
                    title: { type: 'string', example: 'Introduction to Node.js' },
                    content: { type: 'string', example: 'Node.js is an event-driven JavaScript runtime...' },
                    category: { type: 'string', example: 'Technology' },
                    tags: { type: 'array', items: { type: 'string' }, example: ['nodejs', 'express'] },
                    status: { type: 'string', enum: ['draft', 'published'], default: 'published' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Post created successfully' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/posts/search': {
        get: {
          summary: 'Search published posts by keyword',
          tags: ['Posts'],
          parameters: [
            { name: 'keyword', in: 'query', required: true, schema: { type: 'string', example: 'technology' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: {
            200: { description: 'Search results returned' },
          },
        },
      },
      '/api/posts/{id}': {
        get: {
          summary: 'Get single post details by ID',
          tags: ['Posts'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Post details fetched' },
            404: { description: 'Post not found' },
          },
        },
        put: {
          summary: 'Update blog post by ID',
          tags: ['Posts'],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Post updated successfully' },
            403: { description: 'Forbidden (Not owner)' },
          },
        },
        delete: {
          summary: 'Delete post by ID',
          tags: ['Posts'],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Post deleted successfully' },
            403: { description: 'Forbidden' },
          },
        },
      },
      '/api/posts/{id}/publish': {
        post: {
          summary: 'Publish a draft post',
          tags: ['Posts'],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Post published' },
          },
        },
      },
      '/api/posts/{id}/like': {
        post: {
          summary: 'Like / Unlike a post',
          tags: ['Posts'],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Like toggled successfully' },
          },
        },
      },
      '/api/comments': {
        post: {
          summary: 'Add a comment to a post',
          tags: ['Comments'],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['postId', 'content'],
                  properties: {
                    postId: { type: 'string', example: '66fa3b1e9c8d7f0087654321' },
                    content: { type: 'string', example: 'Very informative article!' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Comment created' },
          },
        },
      },
      '/api/comments/post/{id}': {
        get: {
          summary: 'Get all comments for a post',
          tags: ['Comments'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Comments list' },
          },
        },
      },
      '/api/users/{id}/follow': {
        post: {
          summary: 'Follow an author',
          tags: ['Users & Follows'],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Author followed' },
          },
        },
        delete: {
          summary: 'Unfollow an author',
          tags: ['Users & Follows'],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Author unfollowed' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
