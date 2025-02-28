const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productDetails: [
      {
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        image: {
          type: [String],
        },
      },
    ],

    paymentDetails: {
      paymentId: {
        type: String,
      },
      order_id: {
        type: String,
        required: true,
      },
      currency: {
        type: String,
      },
      paid_amount: {
        type: Number,
      },
      payment_method_type: {
        type: String,
      },
      payment_status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
      },
      email: {
        type: String,
      },
      contact: {
        type: String,
      },
      payment_date: {
        type: Date,
      },
    },
    shipping_charge: {
      type: Number,
      default: 0,
    },
    totalPayment: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
