const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const logger = require('./config/logger');
const { apiLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

// Route imports
const employeeRoutes = require('./routes/employeeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compress responses
app.use(compression());

// Parse incoming request JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup HTTP request logging via winston stream
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Rate limiting on API routes
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Server is healthy.',
    data: {
      uptime: process.uptime(),
      timestamp: new Date()
    }
  });
});

// API Routes
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Handle unknown route 404 requests
app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`,
    data: null
  });
});

// Global central error handler middleware
app.use(errorHandler);

module.exports = app;
