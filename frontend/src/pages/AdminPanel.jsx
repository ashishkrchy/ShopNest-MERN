/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar on mobile

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
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        dispatch(setUserDetails(null));
        navigate('/');
        setIsSidebarOpen(false); // Close sidebar on logout in mobile view
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Something went wrong. Try again later.');
    }
  };

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        !event.target.closest('.sidebar') &&
        !event.target.closest('.sidebar-toggle')
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  // Handle link click to close sidebar on mobile
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      // Mobile breakpoint (md: 768px in Tailwind)
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col md:flex-row ml-0.5 mt-2 mb-0.5">
      {/* Sidebar Toggle Button for Mobile */}
      <button
        className="sidebar-toggle md:hidden fixed top-17] left-2 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle Admin Panel Sidebar"
      >
        <svg
          className="w-6 h-6 text-gray-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'
            }
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar fixed md:static inset-0 bg-white min-h-full w-full max-w-60 shadow-lg border-r border-gray-200 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
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
            onClick={handleLinkClick}
          >
            <FaUsers className="text-lg" />
            All Users
          </Link>
          <Link
            to="all-products"
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-gray-900 hover:text-gray-900 font-medium transition-colors duration-200"
            onClick={handleLinkClick}
          >
            <FaBox className="text-lg" />
            All Products
          </Link>
          <Link
            to="orders"
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-gray-900 hover:text-gray-900 font-medium transition-colors duration-200"
            onClick={handleLinkClick}
          >
            <FaBox className="text-lg" />
            Orders
          </Link>
          <Link
            to="analytics"
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-gray-900 hover:text-gray-900 font-medium transition-colors duration-200"
            onClick={handleLinkClick}
          >
            <FaChartBar className="text-lg" />
            Analytics
          </Link>

          <button
            onClick={() => {
              handleLogout();
              handleLinkClick(); // Close sidebar on logout in mobile view
            }}
            className="flex items-center gap-2 px-3 py-2 w-full hover:bg-red-100 rounded-lg text-red-600 hover:text-red-700 font-medium transition-colors duration-200 cursor-pointer"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="w-full h-full p-4 bg-gray-100 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
