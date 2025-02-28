/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaUserPlus } from 'react-icons/fa';
import SummaryApi from '../common/index';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = data;

    if (!name || !email || !password || !confirmPassword) {
      toast.error('All fields are required!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format!');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long!');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    const requestData = { name, email, password, confirmPassword };

    try {
      const response = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const dataObj = await response.json();

      if (!response.ok) {
        toast.error(dataObj.message || 'Sign-up failed');
        return;
      }

      toast.success('Account created successfully!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error('Something went wrong! Try again later.');
    }
  };

  return (
    <section
      id="sign-up"
      className="min-h-[90vh] bg-gray-100 flex justify-center items-center p-4"
    >
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-xl w-full py-4 px-6 flex flex-col items-center">
          {/* Replacing Image with an Icon */}
          <div className="mb-4 text-gray-600">
            <FaUserPlus className="text-5xl" /> {/* Icon with size */}
          </div>

          <form className="space-y-4 w-full max-w-sm" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="bg-white p-3 rounded-lg border border-gray-300">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={data.name}
                  onChange={handleOnChange}
                  placeholder="Enter full name"
                  className="w-full h-full outline-none bg-transparent placeholder-gray-500 text-gray-800"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="bg-white p-3 rounded-lg border border-gray-300">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  placeholder="Enter email"
                  className="w-full h-full outline-none bg-transparent placeholder-gray-500 text-gray-800"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="bg-white p-3 flex items-center rounded-lg border border-gray-300">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={data.password}
                  onChange={handleOnChange}
                  placeholder="Enter password"
                  className="w-full h-full outline-none bg-transparent placeholder-gray-500 text-gray-800"
                  required
                />
                <div
                  className="cursor-pointer ml-3 text-xl text-gray-600 hover:text-blue-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="bg-white p-3 flex items-center rounded-lg border border-gray-300">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleOnChange}
                  placeholder="Confirm password"
                  className="w-full h-full outline-none bg-transparent placeholder-gray-500 text-gray-800"
                  required
                />
                <div
                  className="cursor-pointer ml-3 text-xl text-gray-600 hover:text-blue-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
