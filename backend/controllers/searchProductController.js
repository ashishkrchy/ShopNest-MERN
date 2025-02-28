const Product = require('../models/productModel');

async function searchProductController(req, res) {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        message: 'Search query is required',
        success: false,
        error: true,
      });
    }

    const regex = new RegExp(query, 'ig'); // Case-insensitive search

    const products = await Product.find({
      $or: [{ productName: regex }, { category: regex }],
    });

    res.status(200).json({
      message: 'Products retrieved successfully!',
      success: true,
      error: false,
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Internal Server Error',
      error: true,
      success: false,
    });
  }
}

module.exports = { searchProductController };
