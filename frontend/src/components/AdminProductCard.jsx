/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import AdminProductControls from './AdminProductControls';

const AdminProductCard = ({ product, onEdit, onDelete }) => {
  const discount = Math.round(
    ((product.productPrice - product.selling) / product.productPrice) * 100
  );

  return (
    <div className="bg-gray-900 hover:shadow-lg transition-all duration-300 rounded-sm w-70 p-4 relative">
      {/* Product Image with Hover Zoom Effect */}
      <div className="relative w-full h-45 mb-3 group bg-gray-200 rounded">
        <img
          src={product.productImage[0] || 'https://via.placeholder.com/150'}
          alt={product.productName}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
        />
      </div>

      {/* Product Details */}
      <div className="space-y-2">
        {/* Brand Name */}
        <p className="text-gray-400 text-sm font-medium">{product.brandName}</p>

        {/* Product Name */}
        <h2
          className="text-sm text-gray-100 font-medium line-clamp-2 min-h-[40px] hover:cursor-pointer "
          title={product.productName}
        >
          {product.productName}
        </h2>

        {/* Pricing Section */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-bold text-gray-300">
            ₹{product.selling}
          </span>
          <span className="text-sm text-gray-400 line-through">
            ₹{product.productPrice}
          </span>
          <span className="text-sm font-medium text-green-600">
            {discount}% off
          </span>
        </div>

        {/* Category Badge */}
        <div className="inline-block">
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
            {product.category}
          </span>
        </div>

        {/* Admin Controls Component */}
        <AdminProductControls
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default AdminProductCard;
