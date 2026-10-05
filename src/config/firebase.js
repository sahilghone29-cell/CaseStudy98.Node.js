const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let bucket = null;
let isFirebaseInitialized = false;

// Initialize Firebase Admin SDK conditionally
const initializeFirebase = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (projectId && clientEmail && privateKey && storageBucket) {
    try {
      if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket,
      });

      bucket = admin.storage().bucket();
      isFirebaseInitialized = true;
      console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.warn(`[Firebase Warning] Initialization failed: ${error.message}`);
    }
  } else {
    console.log('[Firebase Info] Credentials not provided in .env. Falling back to local storage handler.');
  }
};

initializeFirebase();

/**
 * Upload a file to Firebase Storage (or save locally if Firebase is unconfigured)
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} Public URL of the uploaded image
 */
const uploadImageToStorage = async (file) => {
  if (!file) return '';

  if (isFirebaseInitialized && bucket) {
    try {
      const fileName = `covers/${Date.now()}_${path.basename(file.originalname)}`;
      const fileUpload = bucket.file(fileName);

      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      return new Promise((resolve, reject) => {
        blobStream.on('error', (error) => {
          reject(error);
        });

        blobStream.on('finish', async () => {
          await fileUpload.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
          resolve(publicUrl);
        });

        blobStream.end(file.buffer);
      });
    } catch (err) {
      console.error('Firebase storage upload failed, using fallback:', err.message);
    }
  }

  // Fallback to local uploads folder if Firebase is not active or fails
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
  const filePath = path.join(uploadsDir, filename);

  if (file.buffer) {
    fs.writeFileSync(filePath, file.buffer);
  } else if (file.path && fs.existsSync(file.path)) {
    fs.copyFileSync(file.path, filePath);
  }

  return `/uploads/${filename}`;
};

/**
 * Verify Firebase ID Token (for Firebase Auth endpoint/middleware support)
 * @param {string} idToken 
 */
const verifyFirebaseToken = async (idToken) => {
  if (!isFirebaseInitialized) {
    throw new Error('Firebase Auth is not configured');
  }
  return await admin.auth().verifyIdToken(idToken);
};

module.exports = {
  admin,
  uploadImageToStorage,
  verifyFirebaseToken,
  isFirebaseInitialized: () => isFirebaseInitialized,
};
