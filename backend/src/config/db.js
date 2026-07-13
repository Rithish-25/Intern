const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb+srv://rithish:rithish@cluster0.fmzkavt.mongodb.net/employee-management?retryWrites=true&w=majority';
    await mongoose.connect(connString);
    logger.info('MongoDB Atlas connected successfully.');
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
