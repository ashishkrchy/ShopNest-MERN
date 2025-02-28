const express = require('express');
const { updateProfile } = require('../controllers/updateProfileController');
const authToken = require('../middleware/authToken'); 

const router = express.Router();

router.put('/profile', authToken, updateProfile);

module.exports = router;
