/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import {
  FaRegUserCircle,
  FaSignOutAlt,
  FaUsers,
  FaBox,
  FaChartBar,
  FaCog,
} from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { setUserDetails } from '../store/userSlice';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import ROLE from '../common/role';

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
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
          theme: 'light',
        });
        dispatch(setUserDetails(null));
        navigate('/');
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Something went wrong. Try again later.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex md:flex-row ml-0.5 mt-1.5 mb-0.5">
      {/* Sidebar */}
      <aside className="bg-white min-h-full w-full max-w-60 shadow-lg border-r border-gray-200">
        <div className="h-32 flex justify-center items-center flex-col border-b border-gray-200 p-4">
          <div className="text-5xl text-slate-900 cursor-pointer flex justify-center mb-2 hover:text-gray-800 transition-colors duration-200">
            <FaRegUserCircle />
          </div>
          <p className="capitalize text-lg font-semibold text-gray-900">
            {user?.name || 'Admin'}
          </p>
          <p className="text-sm font-medium text-gray-400">
            {user?.role || 'Admin'}
          </p>
        </div>

        <nav className="grid p-4 space-y-2">
          <Link
            to="all-users"
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-gray-900 hover:text-gray-900 font-medium transition-colors duration-200"
          >
            <FaUsers className="text-lg" />
            All Users
          </Link>
          <Link
            to="all-products"
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-gray-900 hover:text-gray-900 font-medium transition-colors duration-200"
          >
            <FaBox className="text-lg" />
            All Products
          </Link>
          <Link
            to="orders"
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-gray-900 hover:text-gray-900 font-medium transition-colors duration-200"
          >
            <FaBox className="text-lg" />
            Orders
          </Link>
          <Link
            to="analytics"
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-gray-900 hover:text-gray-900 font-medium transition-colors duration-200"
          >
            <FaChartBar className="text-lg" />
            Analytics
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 w-full hover:bg-red-100 rounded-lg text-red-600 hover:text-red-700 font-medium transition-colors duration-200 cursor-pointer"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="w-full h-full p-4 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
