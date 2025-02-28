const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      minlength: [10, 'Phone Number must be at least 10 digits'],
      maxlength: [15, 'Phone Number cannot exceed 15 digits'],
      trim: true,
      match: [
        /^\d{10,15}$/,
        'Phone Number must be between 10-15 digits and contain only numbers',
      ],
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pinCode: {
        type: String,
        trim: true,
        match: [/^\d{5,6}$/, 'Pin Code must be 5 or 6 digits'],
      },
      country: { type: String, trim: true },
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    role: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
