const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function userSignUpController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
        error: true,
        success: false,
      });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await userModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already in use',
        error: true,
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email: normalizedEmail,
      role: 'GENERAL',
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      success: true,
      error: false,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({
      message: 'Internal Server Error',
      error: true,
      success: false,
    });
  }
}

async function userLoginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
        error: true,
      });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: 'Invalid email or password',
        error: true,
      });
    }

    if (!process.env.JWT_SECRET_KEY) {
      console.error('JWT_SECRET is missing in environment variables');
      return res.status(500).json({
        message: 'Server misconfiguration',
        error: true,
      });
    }

    const tokenData = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: '24h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });

    res.status(200).json({
      message: 'Login successful',
      success: true,
      error: false,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: true });
  }
}

const logoutController = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });

    res.status(200).json({
      success: true,
      error: false,
      message: 'User logged out successfully',
    });
  } catch (error) {
    console.error('Logout Error:', error);
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
