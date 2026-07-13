const admin = require('firebase-admin');
const logger = require('./logger');

let firebaseApp = null;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    // Handle newline character escaping for key strings loaded from environment
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (projectId && clientEmail && privateKey) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    logger.info('Firebase Admin SDK initialized successfully.');
  } else {
    logger.warn('Firebase Admin credentials are not fully set in environment variables. ID token verification will not work.');
  }
} catch (error) {
  logger.error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
}

module.exports = admin;
