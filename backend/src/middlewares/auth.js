const admin = require('../config/firebase');
const logger = require('../config/logger');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
        data: null
      });
    }

    const token = authHeader.split(' ')[1];

    if (!admin || !admin.apps || admin.apps.length === 0) {
      logger.error('Firebase Admin SDK has not been properly initialized.');
      return res.status(500).json({
        success: false,
        message: 'Server security configuration error. Firebase Admin SDK missing.',
        data: null
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || ''
    };

    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid or expired token.',
      data: null
    });
  }
};

module.exports = authenticate;
