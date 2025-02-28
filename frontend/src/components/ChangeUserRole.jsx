/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import ROLE from '../common/role';
import { IoCloseSharp } from 'react-icons/io5';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

// Custom CSS Animations
const styles = `
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulseSlow { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
  @keyframes bounceIn { from { opacity: 0; transform: scale(0.8); } 50% { transform: scale(1.1); } to { opacity: 1; transform: scale(1); } }

  .animate-fade-in { animation: fadeIn 0.8s ease-out; }
  .animate-slide-up { animation: slideUp 0.8s ease-out; }
  .animate-pulse-slow { animation: pulseSlow 2s infinite; }
  .animate-bounce-in { animation: bounceIn 0.8s ease-out; }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

const ChangeUserRole = ({
  userId,
  name,
  email,
  role,
  onClose,
  onRoleUpdate,
}) => {
  console.log('Role' + role);
  const [userRole, setUserRole] = useState(role);
  const [loading, setLoading] = useState(false);

  const handleOnChangeSelect = (e) => {
    setUserRole(e.target.value);
  };

  const updateUserRole = async () => {
    if (!userId) {
      toast.error('User ID is missing!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(SummaryApi.updateUser.url, {
        method: SummaryApi.updateUser.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          role: userRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user role');
      }

      toast.success('User role updated successfully!');
      onRoleUpdate(userId, userRole);
      onClose();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.7)] z-50 p-4 animate-fade-in">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-4 w-full max-w-sm border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-medium text-white">Change User Role</h1>
          <button
            className="text-gray-300 hover:bg-gray-700 rounded-full p-2 transition cursor-pointer shadow-sm hover:shadow-md"
            onClick={onClose}
          >
            <IoCloseSharp size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-gray-300">
            <strong className="text-white">Name:</strong> {name}
          </p>
          <p className="text-gray-300">
            <strong className="text-white">Email:</strong> {email}
          </p>

          <div className="flex items-center justify-between my-3">
            <p className="text-gray-300">Role</p>
            <select
              className="border border-gray-600 px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              value={userRole}
              onChange={handleOnChangeSelect}
              disabled={loading}
            >
              {Object.values(ROLE).map((el) => (
                <option
                  value={el}
                  key={el}
                  className="bg-gray-900 text-white hover:bg-gray-800"
                >
                  {el}
                </option>
              ))}
            </select>
          </div>

          <button
            className="w-full py-2 px-3 rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 transition disabled:bg-orange-500"
            onClick={updateUserRole}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Change Role'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeUserRole;
