const express = require('express');
const {
  getUserOrders,
  getAllOrders,
} = require('../controllers/orderController');
const authToken = require('../middleware/authToken');

const router = express.Router();

// 🛍 User Orders Route
router.get('/orders/user', authToken, getUserOrders);

// 🔧 Admin Routes
router.get('/orders/admin', authToken, getAllOrders);

module.exports = router;
