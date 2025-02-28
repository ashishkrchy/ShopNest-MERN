const express = require('express');
const {
  userSignUpController,
  userLoginController,
  logoutController,
} = require('../controllers/authController');
const validateSignup = require('../middleware/validateSignup');
const validateLogin = require('../middleware/validateLogin');

const authToken = require('../middleware/authToken');

const router = express.Router();

router.post('/signup', validateSignup, userSignUpController);
router.post('/login', validateLogin, userLoginController);
router.get('/logout', authToken, logoutController);

module.exports = router;
