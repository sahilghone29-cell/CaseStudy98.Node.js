const multer = require('multer');

// Memory storage to easily pass buffer to Firebase Storage or local file handler
const storage = multer.memoryStorage();

// File filter to allow only image files (.jpg, .jpeg, .png, .webp)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type. Only .jpg, .jpeg, .png, and .webp images are allowed.'),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter,
});

const uploadCoverImage = upload.single('coverImage');

module.exports = {
  upload,
  uploadCoverImage,
};
