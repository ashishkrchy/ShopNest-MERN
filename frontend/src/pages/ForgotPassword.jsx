/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SummaryApi from '../common';

// Custom CSS Animations
const styles = `
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes bounceIn { from { opacity: 0; transform: scale(0.8); } 50% { transform: scale(1.1); } to { opacity: 1; transform: scale(1); } }

  .animate-fade-in { animation: fadeIn 0.8s ease-out; }
  .animate-slide-up { animation: slideUp 0.8s ease-out; }
  .animate-bounce-in { animation: bounceIn 0.8s ease-out; }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!email.trim()) {
      toast.error('Please enter your email!', { theme: 'dark' });
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address!', { theme: 'dark' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(SummaryApi.forgotPassword.url, {
        method: SummaryApi.forgotPassword.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('A password reset link has been sent to your email!');
        toast.success('Password reset link sent!', { theme: 'dark' });
        setTimeout(() => navigate('/login'), 3000);
      } else {
        throw new Error(data.message || 'Failed to send reset link');
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred. Please try again.');
      toast.error(error.message || 'Failed to send reset link.', {
        theme: 'dark',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="forgot-password"
      className="min-h-screen flex justify-center items-center bg-[#1a2b4b] pt-2"
    >
      <div className="w-full max-w-sm -mt-6">
        <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-700 flex flex-col items-center w-full animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-6 animate-slide-up">
            🔑 Forgot Password
          </h2>
          <form className="space-y-6 w-full max-w-sm" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-full outline-none bg-transparent placeholder-gray-400 text-white"
                  required
                  aria-label="Email for password reset"
                />
              </div>
            </div>

            {message && (
              <p
                className={`text-sm ${
                  message.includes ? 'text-red-500' : 'text-green-500'
                } animate-slide-up`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 shadow-md hover:shadow-lg transition-all cursor-pointer animate-bounce-in"
              disabled={loading}
              aria-label={loading ? 'Sending reset link...' : 'Send Reset Link'}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-400">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-orange-600 hover:text-orange-700 hover:underline transition"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
