const express = require('express');
const { getAdminAnalytics } = require('../controllers/analyticsController');
const authToken = require('../middleware/authToken');

const router = express.Router();

// 📊 Get Admin Dashboard Data
router.get('/analytics/admin-dashboard', authToken, getAdminAnalytics);

module.exports = router;
