const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.name || 'Error'}: ${err.message}`, { stack: err.stack });

  // Handle MongoDB Duplicate Key (e.g. unique email constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `An employee with this ${field} already exists.`,
      data: null
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(422).json({
      success: false,
      message: messages.join(', '),
      data: null
    });
  }

  // Handle invalid Mongoose ObjectIds
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid format for: ${err.path}`,
      data: null
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : message,
    data: null
  });
};

module.exports = errorHandler;
