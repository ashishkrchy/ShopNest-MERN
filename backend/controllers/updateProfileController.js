const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const Order = require('../models/orderModel');

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated request
    const { name, email, phoneNumber, address, password } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: 'Name and email are required' });
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email format' });
    }

    // Validate phone number (optional)
    if (phoneNumber && !/^\d{10,15}$/.test(phoneNumber)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid phone number format' });
    }

    // Validate address fields (optional)
    if (address) {
      const { street, city, state, pinCode, country } = address;
      if (!pinCode || !/^\d{5,6}$/.test(pinCode)) {
        return res
          .status(400)
          .json({ success: false, message: 'Pin code must be 5 or 6 digits' });
      }
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Update fields only if provided
    if (name) user.name = name;
    if (email) {
      user.email = email;
        await Order.updateMany({ userId: user._id }, { $set: { email } });
    } 
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) {
      user.address = { ...user.address.toObject(), ...address }; // Merge with existing fields
    }

    // Handle password update (if provided)
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long',
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save only if changes were made
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { updateProfile };
