
const express = require('express');

const authToken = require('../middleware/authToken');

const {
  createPayment,
  verifyPayment,
} = require('../controllers/paymentController');

const router = express.Router();

router.post('/payment/create', authToken, createPayment);
router.post('/payment/verify', authToken, verifyPayment);

module.exports = router;
