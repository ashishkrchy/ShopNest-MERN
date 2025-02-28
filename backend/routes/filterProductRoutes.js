const express = require('express');

const router = express.Router();

const {
  filterProductController,
} = require('../controllers/filterProductController');

router.post('/filter-product', filterProductController);

module.exports = router;
