const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');

const getAdminAnalytics = async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Access denied! Admins only.' });
    }

    const totalRevenue = await Order.aggregate([
      { $match: { 'paymentDetails.payment_status': 'Completed' } },
      { $group: { _id: null, total: { $sum: '$totalPayment' } } },
    ]);

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      'paymentDetails.payment_status': 'Pending',
    });
    const completedOrders = await Order.countDocuments({
      'paymentDetails.payment_status': 'Completed',
    });

    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) },
    });

    const paymentMethods = await Order.aggregate([
      { $unwind: '$paymentDetails.payment_method_type' },
      {
        $group: {
          _id: '$paymentDetails.payment_method_type',
          count: { $sum: 1 },
        },
      },
    ]);

    const bestSellingProducts = await Order.aggregate([
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.productName',
          totalSold: { $sum: '$productDetails.quantity' },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    const data = {
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalUsers,
      newUsersThisMonth,
      paymentMethods,
      bestSellingProducts,
    };

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAdminAnalytics };
