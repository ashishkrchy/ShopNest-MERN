const Cart = require('../models/cartProduct');
const Product = require('../models/productModel'); // Import Product Model

const addProductToCartController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const existingCartItem = await Cart.findOne({ productId, userId });

    if (existingCartItem) {
      return res.status(400).json({
        message: 'Product already exists in the cart',
        success: false,
        error: true,
      });
    }

    const newCartItem = new Cart({
      productId,
      quantity: 1,
      userId,
    });

    const savedCartItem = await newCartItem.save();

    res.status(200).json({
      message: 'Product added to cart successfully',
      success: true,
      error: false,
      data: savedCartItem,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Internal server error',
      success: false,
      error: true,
    });
  }
};

const countCartProductsController = async (req, res) => {
  try {
    const userId = req.user.id;

    const countProducts = await Cart.countDocuments({ userId });

    res.status(200).json({
      message: 'Product count fetched successfully',
      success: true,
      error: false,
      data: {
        count: countProducts,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Internal server error',
      success: false,
      error: true,
    });
  }
};

const displayCartProductsController = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartProducts = await Cart.find({ userId }).populate('productId');

    res.status(200).json({
      message: 'Cart products fetched successfully',
      success: true,
      error: false,
      data: {
        count: cartProducts.length,
        products: cartProducts, 
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Internal server error',
      success: false,
      error: true,
    });
  }
};

const updateCartItemQuantityController = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id; 


    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const cartItem = await Cart.findOne({ _id: itemId, userId });
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    const product = await Product.findById(cartItem.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available',
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();


    const updatedCart = await Cart.find({ userId }).populate('productId');
    const products = updatedCart.map((item) => ({
      _id: item._id,
      productId: item.productId,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: { products },
      message: 'Quantity updated successfully',
    });
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update quantity',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};


const removeCartItemController = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

 
    const cartItem = await Cart.findOneAndDelete({ _id: itemId, userId });
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    const updatedCart = await Cart.find({ userId }).populate('productId');
    const products = updatedCart.map((item) => ({
      _id: item._id,
      productId: item.productId,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: { products },
      message: 'Item removed from cart successfully',
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  addProductToCartController,
  countCartProductsController,
  displayCartProductsController,
  updateCartItemQuantityController,
  removeCartItemController,
};
