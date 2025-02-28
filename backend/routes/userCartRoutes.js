const express = require('express');
const {
  addProductToCartController,
  countCartProductsController,
  displayCartProductsController,
  updateCartItemQuantityController,
  removeCartItemController,
} = require('../controllers/userCartController');

const authToken = require('../middleware/authToken');

const router = express.Router();

router.post('/cart/add-product', authToken, addProductToCartController);
router.get('/cart/count-products', authToken, countCartProductsController);
router.get('/cart/display-products', authToken, displayCartProductsController);
router.put(
  '/cart/update-product/:itemId',
  authToken,
  updateCartItemQuantityController
);
router.delete(
  '/cart/delete-product/:itemId',
  authToken,
  removeCartItemController
);

module.exports = router;
