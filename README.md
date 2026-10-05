# WriteSpace – Blogging Platform Backend

A robust, modular RESTful API backend for **WriteSpace** — a blogging platform where writers publish articles, engage with readers through comments and likes, and build follower bases. Built with **Node.js**, **Express.js**, **Local MongoDB (Mongoose)**, **JWT Authentication**, and **Firebase Storage**.

---

## 1. Project Overview

WriteSpace is designed as a backend service powering a content creation and publishing platform. It supports full user registration, post lifecycle management (draft to published), full-text search, author follow systems, image uploads to Firebase Storage, and engagement metrics (likes and comments).

## 2. Case Study

**Case Study 98: Backend Development – Blogging Platform**
* **Context:** Writers want to publish articles and engage with readers. Learners build the backend using Node.js, Express.js, MongoDB, and Firebase.
* **Target Audience:** College examination & B.Tech Computer Science Engineering practical demonstration.

## 3. Problem Statement

Modern publishing platforms require scalable, secure, and performant backend architectures that can handle user authentication, structured blog metadata, media storage, relational engagements (followers and likes), and text search without risking data exposure or service degradation.

## 4. Objectives

* Build a clean, modular MVC-structured Express backend.
* Store relational and document data in a **Local MongoDB Community Server** using Mongoose schemas.
* Secure private routes using JWT (JSON Web Tokens).
* Integrate Firebase Admin SDK for optional cloud storage of cover images with local storage fallback.
* Provide interactive API documentation via **Swagger UI** and an importable **Postman Collection**.

## 5. Key Features

* 🔐 **Authentication:** User Registration and Login with password hashing (`bcryptjs`) and JWT token emission.
* 📝 **Post Management:** Create, read, edit, delete, publish, draft autosave (`PUT /api/posts/:id/draft`), and trending posts (`GET /api/posts/trending`).
* 💬 **Commenting:** Add comments on blog posts, view all comments per post, and delete owned comments with automated count tracking.
* ❤️ **Like System:** Atomic toggle like/unlike system preventing duplicate likes and updating total likes count.
* 👥 **Follow System:** Follow and unfollow favorite authors with automated follower/following counters and self-follow prevention.
* 🔍 **Full-Text Search:** Case-insensitive search across title, content, category, and tags.
* 🖼️ **File Uploads:** Multer image upload middleware integrated with **Firebase Storage** (with automated local fallback when cloud keys are omitted).
* 📑 **API Documentation:** Interactive Swagger documentation at `/api-docs`.

---

## 6. Technology Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** Local MongoDB Community Server (`mongodb://127.0.0.1:27017/WriteSpace`)
* **ODM:** Mongoose
* **Authentication:** JWT (`jsonwebtoken`) & Firebase Auth integration support
* **Storage:** Firebase Storage & Multer
* **Validation:** Express Validator (`express-validator`)
* **Security:** Helmet & CORS
* **Documentation:** Swagger UI (`swagger-ui-express`, `swagger-jsdoc`) & Postman

---

## 7. Project Structure

```text
CaseStudy98/
│
├── src/
│   ├── config/
│   │   ├── db.js          # Local MongoDB connection
│   │   ├── firebase.js    # Firebase Admin SDK & Storage config
│   │   └── swagger.js     # OpenAPI / Swagger spec definition
│   │
│   ├── controllers/
│   │   ├── authController.js    # Register, login, current profile logic
│   │   ├── postController.js    # Blog post CRUD, search, like, publish, draft, trending
│   │   ├── commentController.js # Comment creation, retrieval, deletion
│   │   └── userController.js    # User profile, follow/unfollow logic
│   │
│   ├── models/
│   │   ├── User.js        # User schema (email, hashed password, follower counters)
│   │   ├── Post.js        # Post schema (author ref, tags, status, likes, counts)
│   │   ├── Comment.js     # Comment schema (post ref, user ref, content)
│   │   └── Follow.js      # Follow schema (follower ref, following ref, unique index)
│   │
│   ├── routes/
│   │   ├── authRoutes.js    # /api/auth endpoints
│   │   ├── postRoutes.js    # /api/posts endpoints
│   │   ├── commentRoutes.js # /api/comments endpoints
│   │   └── userRoutes.js    # /api/users endpoints
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT Authorization header verification
│   │   ├── uploadMiddleware.js     # Multer file format & size validator
│   │   ├── validationMiddleware.js # Express Validator error handler
│   │   └── errorMiddleware.js      # Centralized error & 404 handler
│   │
│   ├── validators/
│   │   ├── authValidator.js    # Auth payload validation rules
│   │   ├── postValidator.js    # Post payload validation rules
│   │   └── commentValidator.js # Comment payload validation rules
│   │
│   ├── utils/
│   │   ├── jwt.js         # JWT signing & verification helpers
│   │   └── response.js    # Standard API success & error formatters
│   │
│   └── app.js             # Express app middleware & route initialization
│
├── postman/
│   └── WriteSpace.postman_collection.json # Exportable Postman collection
│
├── .env                  # Local environment variable configuration
├── .env.example          # Environment variable template
├── .gitignore            # Git exclusion rules
├── package.json          # Node dependencies & scripts
├── server.js             # Application entry point
└── README.md             # Project documentation & Viva guide
```

---

## 8. Local MongoDB Setup

This project connects exclusively to a **LOCAL MongoDB Community Server**.

**Connection URI:**
```text
mongodb://127.0.0.1:27017/WriteSpace
```

### Steps to start MongoDB locally:
1. Ensure MongoDB Community Server is installed on your local machine.
2. Start the MongoDB service:
   * **macOS:** `brew services start mongodb-community`
   * **Linux:** `sudo systemctl start mongod`
   * **Windows:** Start `MongoDB` service from Windows Services app.
3. The database `WriteSpace` and its collections (`users`, `posts`, `comments`, `follows`) will be generated automatically via Mongoose upon server startup.

---

## 9. Firebase Setup (Optional Cloud Storage)

Firebase Admin SDK is used for uploading blog post cover images to **Firebase Storage**.

If you wish to enable Firebase cloud uploads:
1. Go to Firebase Console and create a Firebase project.
2. Navigate to **Project Settings > Service Accounts** and generate a new private key JSON.
3. Enable **Firebase Storage** in your Firebase project.
4. Fill out the environment variables in `.env`:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_PRIVATE_KEY="your-private-key-with-newlines"
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   ```

*Note: If Firebase credentials are not provided, WriteSpace automatically falls back to local disk storage (`/uploads`) without interrupting application startup or API execution.*

---

## 10. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/WriteSpace

JWT_SECRET=writespace_jwt_secret_btech_exam_key_98
JWT_EXPIRES_IN=7d

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_STORAGE_BUCKET=
```

---

## 11. Installation & Running

### Installation
```bash
npm install
```

### Development Mode (with Nodemon)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Expected startup output:
```text
MongoDB connected successfully: 127.0.0.1
WriteSpace server running on port 5000
Swagger documentation available at http://localhost:5000/api-docs
```

---

## 12. API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| `GET` | `/api/auth/me` | Private | Get authenticated user profile |

### Blog Posts (`/api/posts`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Public | Fetch published posts with pagination (`?page=1&limit=10`) |
| `GET` | `/api/posts/search` | Public | Search published posts (`?keyword=technology`) |
| `GET` | `/api/posts/trending` | Public | Fetch top trending posts by engagement |
| `GET` | `/api/posts/:id` | Public | Fetch single post details with author populate |
| `POST` | `/api/posts` | Private | Create a post (supports `coverImage` upload) |
| `PUT` | `/api/posts/:id` | Private | Update owned post |
| `PUT` | `/api/posts/:id/draft` | Private | Autosave post draft |
| `DELETE` | `/api/posts/:id` | Private | Delete owned post & associated comments |
| `POST` | `/api/posts/:id/publish` | Private | Change post status to `published` |
| `POST` | `/api/posts/:id/like` | Private | Toggle like / unlike post |

### Comments (`/api/comments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/comments` | Private | Add comment on a post |
| `GET` | `/api/comments/post/:id` | Public | Fetch all comments for a post |
| `DELETE` | `/api/comments/:id` | Private | Delete owned comment |

### Users & Follows (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/:id` | Public | Get author profile & published posts |
| `POST` | `/api/users/:id/follow` | Private | Follow an author |
| `DELETE` | `/api/users/:id/follow` | Private | Unfollow an author |

---

## 13. Swagger & Postman

* **Swagger UI:** `http://localhost:5000/api-docs`
* **Postman Collection:** File path `postman/WriteSpace.postman_collection.json`

---

## 14. Viva / Examination Q&A Guide

When presenting this project in a B.Tech Computer Science Viva / Practical Examination, use the following explanations:

1. **What is Node.js & Express.js?**
   * *Node.js* is an asynchronous, event-driven JavaScript runtime built on Chrome's V8 engine allowing server-side execution. *Express.js* is a minimalist web framework for Node.js that simplifies routing, HTTP request handling, and middleware integration.
2. **What is a REST API?**
   * Representational State Transfer (REST) is an architectural style for APIs using stateless HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) with standard JSON request/response formats.
3. **Why use local MongoDB and Mongoose?**
   * MongoDB is a NoSQL document database that stores flexible JSON-like BSON documents. Mongoose is an Object Data Modeling (ODM) library for MongoDB that provides schema validation, business logic hooks (`pre-save`), and relationship building (`populate`).
4. **How does JWT Authentication work?**
   * Upon login, the server signs user payload data with a secret key (`JWT_SECRET`) to create a token. The client includes this token in the `Authorization: Bearer <token>` header for subsequent requests. `authMiddleware` verifies the token statelessly without requiring session database lookups.
5. **What is Middleware in Express?**
   * Middleware functions execute during the HTTP request-response cycle, receiving `req`, `res`, and `next`. They perform tasks like authentication checks, request validation, file parsing, and error catching before passing control to the next handler using `next()`.
6. **What is `populate` in Mongoose?**
   * `populate()` automatically replaces specified ObjectId reference fields in a document (e.g. `author` in Post) with actual documents from another collection (`User`).
7. **Why hash passwords with `bcryptjs`?**
   * Storing plain text passwords is a security risk. `bcryptjs` uses a salted one-way hashing algorithm (`bcrypt.hash`) that makes it computationally infeasible to reverse or crack via rainbow table attacks.
