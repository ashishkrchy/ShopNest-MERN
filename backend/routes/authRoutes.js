const express = require('express');
const {
  userSignUpController,
  userLoginController,
  logoutController,
} = require('../controllers/authController');
const validateSignUp = require('../middleware/validateSignUp');
const validateLogin = require('../middleware/validateLogin');

const authToken = require('../middleware/authToken');

const router = express.Router();

router.post('/signup', validateSignUp, userSignUpController);
router.post('/login', validateLogin, userLoginController);
router.post('/logout', authToken, logoutController);

module.exports = router;
