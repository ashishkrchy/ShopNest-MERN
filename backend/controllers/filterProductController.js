const Product = require('../models/productModel');

async function filterProductController(req, res) {
  try {
    const { categories, brands, minPrice, maxPrice, sortBy } = req.body;

    // Validate required fields (at least one filter criterion)
    if (
      !categories?.length &&
      !brands?.length &&
      !minPrice &&
      !maxPrice &&
      !sortBy
    ) {
      return res.status(400).json({
        message:
          'Please provide at least one filter criterion (categories, brands, price range, or sort)',
        success: false,
        data: [],
      });
    }

    // Build the query object
    const query = {};

    // Filter by categories (if provided)
    if (categories && categories.length > 0) {
      query.category = { $in: categories };
    }

    // Filter by brands (if provided)
    if (brands && brands.length > 0) {
      query.brandName = { $in: brands };
    }

    // Filter by price range (if provided)
    if (minPrice || maxPrice) {
      query.selling = {};
      if (minPrice) query.selling.$gte = parseFloat(minPrice) || 0;
      if (maxPrice) query.selling.$lte = parseFloat(maxPrice) || Infinity;
    }

    // Fetch products with the query
    let filteredProducts = await Product.find(query);

    // Apply sorting (if provided)
    if (sortBy) {
      switch (sortBy) {
        case 'price-low':
          filteredProducts = filteredProducts.sort(
            (a, b) => a.selling - b.selling
          );
          break;
        case 'price-high':
          filteredProducts = filteredProducts.sort(
            (a, b) => b.selling - a.selling
          );
          break;
        case 'newest':
          filteredProducts = filteredProducts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        default: // relevance (no sorting needed, keep original order)
          break;
      }
    }

    // Check if products exist
    if (!filteredProducts.length) {
      return res.status(404).json({
        message: 'No products found for the selected filters',
        success: false,
        data: [],
      });
    }

    // Format response to match frontend expectations
    const formattedProducts = filteredProducts.map((product) => ({
      _id: product._id,
      productName: product.productName,
      brandName: product.brandName,
      selling: product.selling,
      productImage: product.productImage,
      category: product.category,
      description: product.productDescription,
      seller: product.seller || 'No Seller', // Assuming seller field exists or defaults
      productPrice: product.productPrice || product.selling * 1.25, // Mock original price for discount
      createdAt: product.createdAt,
    }));

    res.status(200).json({
      message: 'Products fetched successfully',
      success: true,
      data: formattedProducts,
    });
  } catch (err) {
    console.error('Error filtering products:', err);
    res.status(500).json({
      message: err.message || 'Internal Server Error',
      success: false,
    });
  }
}

module.exports = { filterProductController };
