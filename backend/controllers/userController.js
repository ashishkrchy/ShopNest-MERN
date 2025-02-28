const User = require('../models/userModel');

const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error. Unable to fetch users.',
      error: error.message,
    });
  }
};

async function userDetailsController(req, res) {
  try {
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, role, address, phoneNumber } = user;

    res.status(200).json({
      message: 'User found!',
      success: true,
      error: false,
      data: { name, email, role, address, phoneNumber },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Internal Server Error',
      error: true,
      success: false,
    });
  }
}

const updateUserController = async (req, res) => {
  try {
    const currLoggedUserRole = req.user?.role;
    const currLoggedUserId = req.user?.id;

    if (currLoggedUserRole !== 'ADMIN') {
      return res.status(403).json({
        message: 'Access denied. Only admins can update users.',
        success: false,
        error: true,
      });
    }

    const { userId, email, name, role } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required',
        success: false,
        error: true,
      });
    }

    if (userId === currLoggedUserId && role && role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Admins cannot downgrade their own role.',
        success: false,
        error: true,
      });
    }

    const payload = {
      ...(email && { email }),
      ...(name && { name }),
      ...(role !== undefined && { role }),
    };

    const updateUser = await User.findByIdAndUpdate(userId, payload, {
      new: true,
      runValidators: true,
    });

    if (!updateUser) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
        error: true,
      });
    }

    res.status(200).json({
      message: 'User updated successfully',
      data: updateUser,
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

module.exports = {
  getAllUsersController,
  userDetailsController,
  updateUserController,
};
