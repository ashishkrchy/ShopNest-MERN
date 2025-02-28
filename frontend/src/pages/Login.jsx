/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginlogo from '../assets/loginlogo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SummaryApi from '../common/index';
import Context from '../context';

const Login = () => {
  const { fetchUserDetails } = useContext(Context);
  const { fetchUserAddToCartProductCount } = useContext(Context);

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      toast.error('Email and Password are required!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error('Invalid email format!');
      return;
    }

    try {
      const response = await fetch(SummaryApi.Login.url, {
        method: SummaryApi.Login.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || 'Login failed!');
        return;
      }

      toast.success('Login Successful!', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(async () => {
        navigate('/');
        await fetchUserDetails();
        await fetchUserAddToCartProductCount();
      }, 2000);
    } catch (error) {
      toast.error('Server error! Please try again later.');
    }
  };

  return (
    <section
      id="login"
      className="min-h-screen flex justify-center items-center bg-gray-100 pt-2"
    >
      <div className="w-full max-w-sm -mt-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 flex flex-col items-center w-full">
          <div className="mb-6 bg-blue-100 rounded-full">
            <img
              src={loginlogo}
              alt="loginlogo"
              className="w-24 h-24 object-contain mix-blend-multiply"
            />
          </div>
          <form className="space-y-6 w-full max-w-sm" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-300">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  placeholder="Enter email"
                  className="w-full h-full outline-none bg-transparent placeholder-gray-400 text-gray-700 rounded"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="bg-gray-50 p-3 flex items-center rounded-lg border border-gray-300">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={data.password}
                  onChange={handleOnChange}
                  placeholder="Enter password"
                  className="w-full h-full outline-none bg-transparent placeholder-gray-400 text-gray-700"
                />
                <div
                  className="cursor-pointer ml-3 text-xl text-gray-500 hover:text-blue-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
              <Link
                to="/forgot-password"
                className="block mt-2 text-sm text-blue-600 hover:text-blue-700 hover:underline transition"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              to="/sign-up"
              className="text-blue-600 hover:text-blue-700 hover:underline transition"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
