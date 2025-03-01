/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SummaryApi from '../common';
import moment from 'moment';
import { MdEdit } from 'react-icons/md';
import ChangeUserRole from '../components/ChangeUserRole';

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.allUser.url, {
        method: SummaryApi.allUser.method,
        credentials: 'include',
      });

      if (!response.ok) {
        toast.error('Failed to fetch users');
        throw new Error('Failed to fetch users');
      }

      const allData = await response.json();
      setAllUsers(allData.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const handleRoleUpdate = (userId, newRole) => {
    setAllUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 pb-6 pt-4 max-h-[calc(100vh-100px)] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">All Users</h2>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-black text-gray-200">
                <th className="border-b border-gray-200 px-2 sm:px-4 py-3 text-center text-sm sm:text-base font-medium">
                  Sr.
                </th>
                <th className="border-b border-gray-200 px-2 sm:px-4 py-3 text-center text-sm sm:text-base font-medium">
                  Name
                </th>
                <th className="border-b border-gray-200 px-2 sm:px-4 py-3 text-center text-sm sm:text-base font-medium">
                  Email
                </th>
                <th className="border-b border-gray-200 px-2 sm:px-4 py-3 text-center text-sm sm:text-base font-medium">
                  Role
                </th>
                <th className="border-b border-gray-200 px-2 sm:px-4 py-3 text-center text-sm sm:text-base font-medium">
                  Created At
                </th>
                <th className="border-b border-gray-200 px-2 sm:px-4 py-3 text-center text-sm sm:text-base font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {allUser.length > 0 ? (
                allUser.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    <td className="border-b border-gray-200 px-2 sm:px-4 py-3 text-sm text-gray-600 text-center">
                      {index + 1}
                    </td>
                    <td className="border-b border-gray-200 px-2 sm:px-4 py-3 text-sm text-gray-600 text-center">
                      {user.name || 'N/A'}
                    </td>
                    <td className="border-b border-gray-200 px-2 sm:px-4 py-3 text-sm text-gray-600 text-center">
                      {user.email || 'N/A'}
                    </td>
                    <td className="border-b border-gray-200 px-2 sm:px-4 py-3 text-sm text-gray-600 text-center">
                      {user.role || 'User'}
                    </td>
                    <td className="border-b border-gray-200 px-2 sm:px-4 py-3 text-sm text-gray-600 text-center">
                      {moment(user.createdAt).format('LL')}
                    </td>
                    <td className="border-b border-gray-200 px-2 sm:px-4 py-3 text-sm text-gray-200 text-center">
                      <button
                        className="bg-gray-600 p-2 rounded-full cursor-pointer hover:bg-gray-700 hover:text-white transition-colors duration-200"
                        onClick={() => setSelectedUser(user)}
                      >
                        <MdEdit size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Show ChangeUserRole modal only if a user is selected */}
        {selectedUser && (
          <ChangeUserRole
            userId={selectedUser._id}
            name={selectedUser.name}
            email={selectedUser.email}
            role={selectedUser.role}
            onClose={() => setSelectedUser(null)}
            onRoleUpdate={handleRoleUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default AllUsers;
