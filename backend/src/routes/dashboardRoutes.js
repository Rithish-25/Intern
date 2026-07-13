const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const authenticate = require('../middlewares/auth');

// Protect the stats route with Firebase authentication middleware
router.get('/stats', authenticate, getDashboardStats);

module.exports = router;
