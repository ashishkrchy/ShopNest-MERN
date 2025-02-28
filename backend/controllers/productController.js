const Product = require('../models/productModel');

const uploadProductController = async (req, res) => {
  try {
    const sessionUserId = req.user;

    if (!sessionUserId.role || sessionUserId.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Forbidden: You do not have permission to upload products',
        success: false,
        error: true,
      });
    }
    const {
      productName,
      brandName,
      category,
      productImage,
      productDescription,
      productPrice,
      selling,
    } = req.body;

    if (
      !productName ||
      !brandName ||
      !category ||
      !productDescription ||
      !productPrice ||
      !selling
    ) {
      return res.status(400).json({
        message: 'All required fields must be provided',
        success: false,
        error: true,
      });
    }

    const newProduct = await Product.create({
      productName,
      brandName,
      category,
      productImage: productImage || '',
      productDescription,
      productPrice,
      selling,
    });

    res.status(201).json({
      message: 'Product uploaded successfully',
      data: newProduct,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Internal server error',
      error: true,
      success: false,
    });
  }
};

async function getProductController(req, res) {
  try {
    const allProducts = await Product.find().sort({ createdAt: -1 });

    if (allProducts.length === 0) {
      return res.status(404).json({
        message: 'No products found',
        success: false,
        error: true,
      });
    }

    res.status(200).json({
      message: 'Products retrieved successfully!',
      success: true,
      error: false,
      data: allProducts,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Internal Server Error',
      error: true,
      success: false,
    });
  }
}

async function updateProductController(req, res) {
  try {
    const sessionUserId = req.user;

    if (sessionUserId.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Forbidden: You do not have permission to update products',
        success: false,
        error: true,
      });
    }

    const updateData = req.body;
    const productId = req.params.id;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: 'Product not found',
        success: false,
        error: true,
      });
    }

    res.status(200).json({
      message: 'Product updated successfully!',
      success: true,
      error: false,
      data: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Internal Server Error',
      error: true,
      success: false,
    });
  }
}

const getProductCategoryListController = async (req, res) => {
  try {
    const productCategory = await Product.distinct('category');

    if (productCategory.length === 0) {
      return res.status(404).json({
        message: 'No product categories found',
        success: false,
        error: true,
      });
    }

    const productByCategory = await Product.aggregate([
      {
        $match: { category: { $in: productCategory } },
      },
      {
        $group: {
          _id: '$category',
          product: { $first: '$$ROOT' },
        },
      },
      {
        $replaceRoot: { newRoot: '$product' },
      },
    ]);

    res.status(200).json({
      message: 'Products retrieved successfully!',
      success: true,
      error: false,
      data: productByCategory,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Internal Server Error',
      error: true,
      success: false,
    });
  }
};

const getCategoryProductController = async (req, res) => {
  try {
    const productCategory = req.params.category;

    const categoryProduct = await Product.find({ category: productCategory });

    if (categoryProduct.length === 0) {
      return res.status(404).json({
        message: 'No products found for this category',
        success: false,
        error: true,
      });
    }

    res.status(200).json({
      message: 'Products retrieved successfully!',
      success: true,
      error: false,
      data: categoryProduct,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Internal Server Error',
      error: true,
      success: false,
    });
  }
};

const getIndividualProductController = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        success: false,
        error: true,
      });
    }

    res.status(200).json({
      message: 'Product retrieved successfully!',
      success: true,
      error: false,
      data: product,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Internal Server Error',
      error: true,
      success: false,
    });
  }
};

async function deleteProductController(req, res) {
  try {
    const sessionUserId = req.user;

    if (sessionUserId.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Forbidden: You do not have permission to delete products',
        success: false,
        error: true,
      });
    }

    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        message: 'Product not found',
        success: false,
        error: true,
      });
    }

    res.status(200).json({
      message: 'Product deleted successfully!',
      success: true,
      error: false,
      data: deletedProduct,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Internal Server Error',
      error: true,
      success: false,
    });
  }
}

module.exports = {
  uploadProductController,
  getProductController,
  updateProductController,
  getProductCategoryListController,
  getCategoryProductController,
  getIndividualProductController,
  deleteProductController,
};
