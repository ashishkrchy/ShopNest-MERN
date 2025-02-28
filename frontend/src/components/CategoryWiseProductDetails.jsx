/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const CategoryWiseProductDisplay = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadingList = new Array(6).fill(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${SummaryApi.getCategoryProduct.url}/${category}`
        );
        const result = await response.json();
        if (result.success) {
          setData(result.data || []);
        } else {
          throw new Error(result.message || 'Failed to fetch products');
        }
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const { fetchUserAddToCartProductCount } = useContext(Context);
  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    await fetchUserAddToCartProductCount();
  };

  const getDiscount = (productPrice, sellingPrice) => {
    if (!productPrice || !sellingPrice || productPrice <= 0) return 0;
    return Math.round(((productPrice - sellingPrice) / productPrice) * 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 py-4">
          Loading {heading}...
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {loadingList.map((_, index) => (
            <div
              key={index}
              className="w-full h-[380px] bg-gray-200 rounded-lg shadow-md flex flex-col p-4"
            >
              <div className="w-full h-48 bg-gray-300 rounded-lg mb-3"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 py-4">{heading}</h2>
        <p className="text-red-500 text-center py-4">Error: {error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 py-4">{heading}</h2>
        <p className="text-gray-500 text-center py-4">
          No products found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 py-4">{heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {data.map((product, index) => {
          const discount = getDiscount(product.productPrice, product.selling);
          return (
            <Link
              to={`/product/${product._id}`}
              key={product._id || index}
              className="w-full bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-full h-48 bg-white shadow rounded-lg flex items-center justify-center overflow-hidden mb-3">
                <img
                  src={
                    product.productImage[0] || 'https://via.placeholder.com/150'
                  }
                  alt={product.productName}
                  className="w-full h-full object-contain rounded-lg mix-blend-multiply"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-800 line-clamp-1">
                  {product.productName || 'Unnamed Product'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {product.brandName || 'No Brand'}
                </p>
                <div className="flex justify-center items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-gray-800">
                    ₹{product.selling || 0}
                  </span>
                  {product.productPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.productPrice}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="text-sm font-medium text-green-600">
                      {discount}% off
                    </span>
                  )}
                </div>
                <button
                  className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                  onClick={(e) => handleAddToCart(e, product?._id)}
                >
                  Add to Cart
                </button>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200">
          1
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 hover:shadow-sm transition-colors duration-200">
          2
        </button>
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
