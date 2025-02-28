const express = require('express');
const router = express.Router();

const {
  getAllUsersController,
  userDetailsController,
  updateUserController,
} = require('../controllers/userController');

const authTokenMiddleware = require('../middleware/authToken');

router.get('/profile', authTokenMiddleware, userDetailsController);
router.post('/update-profile', authTokenMiddleware, updateUserController);
router.get(
  '/admin-users',
  authTokenMiddleware,

  getAllUsersController
);

module.exports = router;
