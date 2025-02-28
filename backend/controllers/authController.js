const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function userSignUpController(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Email already in use', error: true, success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      name,
      email,
      role: 'GENERAL',
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      success: true,
      error: false,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Error in userSignUpController:', err);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: true, success: false });
  }
}

async function userLoginController(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: 'Invalid email or password', error: true });
    }

    const tokenData = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRY || '24h',
    });

    res
      .cookie('auth_token', token, {
        httpOnly: true,
        // sameSite: 'None', // Allows cross-origin requests
      })
      .status(200)
      .json({
        message: 'Login successful',
        success: true,
        error: false,
        user: { id: user._id, name: user.name, email: user.email },
      });
  } catch (err) {
    console.error('Error in userLoginController:', err);
    res.status(500).json({ message: 'Internal Server Error', error: true });
  }
}

const logoutController = async (req, res) => {
  try {
    res.cookie('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      error: false,
      message: 'User logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: 'Logout failed',
    });
  }
};

module.exports = {
  userSignUpController,
  userLoginController,
  logoutController,
};
