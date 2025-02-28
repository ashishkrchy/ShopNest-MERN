const Order = require('../models/orderModel'); // Import Order Model
const moment = require('moment'); // Import moment for date formatting

// ✅ Get Orders for a Specific User
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: 'No orders found',
      });
    }

    // Format dates for each order
    const formattedOrders = orders.map((order) => ({
      ...order,
      createdAt: moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss'), // Full Date-Time
      updatedAt: moment(order.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      paymentDetails: {
        ...order.paymentDetails,
        payment_date: order.paymentDetails?.payment_date
          ? moment(order.paymentDetails.payment_date).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          : 'Not available', // Format payment date if available
      },
    }));

    res.json({ success: true, orders: formattedOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied! Admins only.',
      });
    }

    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: 'No orders available',
      });
    }

    // Format dates for each order
    const formattedOrders = orders.map((order) => ({
      ...order,
      createdAt: moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(order.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      paymentDetails: {
        ...order.paymentDetails,
        payment_date: order.paymentDetails?.payment_date
          ? moment(order.paymentDetails.payment_date).format(
              'DD-MM-YYYY HH:mm:ss'
            )
          : 'Not available', 
      },
    }));

    res.json({ success: true, orders: formattedOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserOrders,
  getAllOrders,
};
