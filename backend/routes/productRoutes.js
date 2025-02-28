const express = require('express');

const router = express.Router();

const {
  uploadProductController,
  getProductController,
  updateProductController,
  getProductCategoryListController,
  getIndividualProductController,
  getCategoryProductController,
  deleteProductController,
} = require('../controllers/productController');

const authToken = require('../middleware/authToken');

router.post('/upload-product', authToken, uploadProductController);
router.get('/all-products', getProductController); 
router.put('/update-product/:id', authToken, updateProductController);
router.delete('/delete-product/:id', authToken, deleteProductController);
router.get('/get-category-list', getProductCategoryListController); 
router.get('/get-category-product/:category', getCategoryProductController);
router.get('/get-individual-product/:id', getIndividualProductController);

module.exports = router;
