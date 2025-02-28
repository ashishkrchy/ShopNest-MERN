const crypto = require('crypto');
const Razorpay = require('razorpay');
const orderModel = require('../models/orderModel');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createPayment = async (req, res) => {
  try {
    const { products, amount, shippingCharge } = req.body;
    const userId = req.user?.id;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Invalid cart data' });
    }

    const options = {
      amount: (amount + shippingCharge) * 100,
      currency: 'INR',
      receipt: `order_rcpt_${Date.now()}`,
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(options);
    } catch (error) {
      console.error(
        'Razorpay Order Creation Failed:',
        error?.error?.description || error.message
      );
      return res.status(500).json({
        error: 'Failed to create Razorpay order',
        details: error?.error?.description || error.message,
      });
    }

    const productDetails = products.map((product) => ({
      productID: product.id,
      productName: product.name,
      price: product.price,
      quantity: product.quantity,
      image: product.image || [],
    }));

    const newOrder = new orderModel({
      email: req.user.email,
      productDetails,
      userId,
      paymentDetails: {
        order_id: razorpayOrder.id, // Save only the order_id, not payment details yet
        payment_status: 'Pending', // Will be updated after payment
      },
      shipping_charge: shippingCharge,
      totalPayment: amount + shippingCharge,
    });

    await newOrder.save();

    res.json({
      success: true,
      message: 'Order created successfully',
      order: razorpayOrder,
    });
  } catch (error) {
    console.error('Error Creating Payment:', error.message);
    res.status(500).json({ error: error.message });
  }
};
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment details' });
    }

    // Step 1: Verify the payment signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Step 2: Fetch payment details from Razorpay
    let payment;
    try {
      payment = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (err) {
      return res
        .status(404)
        .json({ error: 'Failed to fetch payment details from Razorpay' });
    }

    if (!payment) {
      return res.status(404).json({ error: 'Payment details not found' });
    }

    // Step 3: Find the corresponding order in the database
    const order = await orderModel.findOne({
      'paymentDetails.order_id': razorpay_order_id,
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Step 4: Update the order with payment details
    order.paymentDetails.paymentId = payment.id;
    order.paymentDetails.paid_amount = payment.amount / 100; // Convert from paise to INR
    order.paymentDetails.currency = payment.currency || 'INR';
    order.paymentDetails.payment_method_type = payment.method || 'Unknown';
    order.paymentDetails.payment_status = 'Completed';
    order.paymentDetails.email = payment.email || order.email;
    order.paymentDetails.contact = payment.contact || '';

    const paymentDate = new Date(payment.created_at * 1000); 
    console.log(paymentDate.toLocaleString()); 

  
    order.paymentDetails.payment_date = paymentDate;

    await order.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      order,
    });
  } catch (error) {
    console.error('Payment Verification Failed:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  verifyPayment,
  createPayment,
};
