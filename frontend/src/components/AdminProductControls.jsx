/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';

const AdminProductControls = ({ product, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
      {/* Edit Button */}
      <button
        onClick={() => onEdit(product)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-md transition-all duration-200 cursor-pointer shadow-sm"
      >
        <FaRegEdit className="text-lg" />
        <span>Edit</span>
      </button>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(product._id)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-100 rounded-md transition-all duration-200 cursor-pointer shadow-sm"
      >
        <FaTrashAlt className="text-lg" />
        <span>Delete</span>
      </button>
    </div>
  );
};

export default AdminProductControls;
