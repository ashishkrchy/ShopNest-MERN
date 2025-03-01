/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaHistory,
  FaMapMarkerAlt,
  FaCreditCard,
  FaHeadset,
  FaPercent,
  FaWallet,
  FaQuestionCircle,
  FaRegStar,
  FaTruck,
} from 'react-icons/fa';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import moment from 'moment';
import UserOrders from './UserOrders';
import AdminOrders from './AdminOrders';
import Context from '../context';

const Profile = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle nested address fields
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));

    if (errors.address?.[name]) {
      setErrors((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: '' },
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!updatedUser.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (
      !updatedUser.email?.trim() ||
      !/^\S+@\S+\.\S+$/.test(updatedUser.email)
    ) {
      newErrors.email = 'Valid email is required';
    }

    if (updatedUser.password?.trim() && updatedUser.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (
      !updatedUser.phoneNumber?.trim() ||
      !/^\d{10,15}$/.test(updatedUser.phoneNumber)
    ) {
      newErrors.phoneNumber =
        'Phone number must be between 10-15 digits and contain only numbers';
    }

    if (updatedUser.address) {
      newErrors.address = {};
      if (!updatedUser.address.street?.trim()) {
        newErrors.address.street = 'Street is required';
      }
      if (!updatedUser.address.city?.trim()) {
        newErrors.address.city = 'City is required';
      }
      if (!updatedUser.address.state?.trim()) {
        newErrors.address.state = 'State is required';
      }
      if (
        !updatedUser.address.pinCode?.trim() ||
        !/^\d{5,6}$/.test(updatedUser.address.pinCode)
      ) {
        newErrors.address.pinCode = 'Pin code must be 5 or 6 digits';
      }
      if (!updatedUser.address.country?.trim()) {
        newErrors.address.country = 'Country is required';
      }

      if (Object.keys(newErrors.address).length === 0) {
        delete newErrors.address;
      }
    }

    return newErrors;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(SummaryApi.update_userProfile.url, {
        method: SummaryApi.update_userProfile.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();

      if (data.success) {
        dispatch(setUserDetails(updatedUser));
        setUpdatedUser({ ...updatedUser, ...data.user });
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(
          'Failed to update profile: ' + (data.message || 'Unknown error')
        );
      }
    } catch (error) {
      toast.error('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.logout.url, {
        method: SummaryApi.logout.method,
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Logged out successfully', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');

        dispatch(setUserDetails(null));
        navigate('/');
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleUpdateProfile} className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={updatedUser.name || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-800 ${
                    isEditing ? '' : 'bg-gray-200'
                  }`}
                  placeholder="Enter your name"
                  aria-label="Name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={updatedUser.phoneNumber || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-800 ${
                    isEditing ? '' : 'bg-gray-200'
                  }`}
                  placeholder="Enter your Phone number"
                  aria-label="Phone Number"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={updatedUser.email || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-800 ${
                    isEditing ? '' : 'bg-gray-200'
                  }`}
                  placeholder="Enter your email"
                  aria-label="Email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Address Fields - Display Only When Editing */}
              {isEditing && (
                <>
                  {/* Street */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={updatedUser.address?.street || ''}
                      onChange={handleAddressChange}
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-800"
                      placeholder="Enter your street"
                      aria-label="Street"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={updatedUser.address?.city || ''}
                      onChange={handleAddressChange}
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-800"
                      placeholder="Enter your city"
                      aria-label="City"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={updatedUser.address?.state || ''}
                      onChange={handleAddressChange}
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-800"
                      placeholder="Enter your state"
                      aria-label="State"
                    />
                  </div>

                  {/* Pin Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pin Code
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      value={updatedUser.address?.pinCode || ''}
                      onChange={handleAddressChange}
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-800"
                      placeholder="Enter your Pin Code"
                      aria-label="Pin Code"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={updatedUser.address?.country || ''}
                      onChange={handleAddressChange}
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-800"
                      placeholder="Enter your country"
                      aria-label="Country"
                    />
                  </div>
                </>
              )}
            </div>

            {/* New Password Field (Optional) */}
            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  name="password"
                  value={updatedUser.password || ''}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-800`}
                  placeholder="Leave blank to keep unchanged"
                  aria-label="New Password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="relative flex justify-between items-center pt-4">
              {isEditing ? (
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
                    disabled={loading}
                    aria-label="Save Changes"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setUpdatedUser({ ...user });
                      setErrors({});
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 transition-colors cursor-pointer"
                    disabled={loading}
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors cursor-pointer absolute right-0"
                  aria-label="Edit Profile"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        );

      case 'orders':
        return user?.role === ROLE.ADMIN ? (
          <div className="space-y-6 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Orders
            </h3>
            <AdminOrders />
          </div>
        ) : (
          <div className="space-y-6 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              My Orders
            </h3>
            <UserOrders />
          </div>
        );

      case 'addresses':
        return (
          <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Saved Addresses
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-shadow shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium">
                    Home
                  </span>
                </div>
                <p className="text-gray-700">{user.address.street}</p>
                <p className="text-gray-500 text-sm">
                  {user.address.city}, {user.address.state} -
                  {user.address.pinCode}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* User Summary Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center shadow-md">
                  <FaUser className="text-4xl text-gray-600" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-800">
                  {user.name}
                </h1>
                <p className="text-gray-500">{user.email}</p>
                <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-4">
                  {user?.role === ROLE.ADMIN ? (
                    <>
                      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                        <FaCog className="text-green-400" />
                        <span>Admin</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                        <FaRegStar className="text-yellow-400" />
                        <span>User</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg shadow-md transition-colors cursor-pointer"
                  disabled={loading}
                  aria-label="Logout"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'profile'
                      ? 'border-b-2 border-blue-600 text-blue-600 bg-gray-100'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                  } transition-colors duration-200`}
                >
                  <FaUser className="inline-block mr-2 text-xl" /> Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'orders'
                      ? 'border-b-2 border-blue-600 text-blue-600 bg-gray-100'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                  } transition-colors duration-200`}
                >
                  <FaHistory className="inline-block mr-2 text-xl" /> Orders
                </button>
                {user?.role !== ROLE.ADMIN && (
                  <>
                    <button
                      onClick={() => setActiveTab('addresses')}
                      className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                        activeTab === 'addresses'
                          ? 'border-b-2 border-blue-600 text-blue-600 bg-gray-100'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                      } transition-colors duration-200`}
                    >
                      <FaMapMarkerAlt className="inline-block mr-2 text-xl" />{' '}
                      Addresses
                    </button>
                  </>
                )}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">{renderTabContent()}</div>
          </div>

          {/* Quick Links for General Users or Admin-Specific Insights */}
          {user?.role === ROLE.ADMIN ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <Link
                to="/admin-panel/all-users"
                className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
              >
                <FaUser className="text-blue-600 text-xl" />
                <div>
                  <h3 className="font-medium text-gray-800">Manage Users</h3>
                  <p className="text-sm text-gray-500">View & Manage Users</p>
                </div>
              </Link>
              <Link
                to="/admin-panel/orders"
                className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
              >
                <FaTruck className="text-green-600 text-xl" />
                <div>
                  <h3 className="font-medium text-gray-800">Manage Orders</h3>
                  <p className="text-sm text-gray-500">Track Orders</p>
                </div>
              </Link>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                disabled={loading}
              >
                {loading ? 'Logging out...' : 'Yes, Logout'}
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 transition-colors cursor-pointer"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
