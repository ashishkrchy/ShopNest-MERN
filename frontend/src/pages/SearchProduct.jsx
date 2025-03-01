/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import productCategory from '../helpers/productCategory';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { IoFilterSharp, IoGrid, IoList } from 'react-icons/io5';
import SummaryApi from '../common';
import Context from '../context';
import addToCart from '../helpers/addToCart';
import { toast } from 'react-toastify';

const SearchProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const { search } = useLocation();
  const searchQuery = new URLSearchParams(search).get('q');

  const handleSortChange = (value) => {
    setSortBy(value);

    const sortedProducts = [...products];
    switch (value) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.selling - b.selling);
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => b.selling - a.selling);
        break;
      case 'newest':
        sortedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        break;
    }
    setProducts(sortedProducts);
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyPriceFilter = () => {
    const filtered = products.filter((product) => {
      const price = product.selling;
      const min = priceRange.min ? parseFloat(priceRange.min) : 0;
      const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      return price >= min && price <= max;
    });
    setProducts(filtered);
  };

  const toggleBrandFilter = (brand) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brand)) {
        return prev.filter((b) => b !== brand);
      }
      return [...prev, brand];
    });
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!search) {
        setLoading(false);
        setProducts([]);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${SummaryApi.searchProducts.url}${search}`
        );

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Search failed');
        }

        setProducts(result.data || []);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [search]);

  const { fetchUserAddToCartProductCount } = useContext(Context);
  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    await fetchUserAddToCartProductCount();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                <div key={n} className="bg-white p-2 sm:p-4 rounded-lg shadow">
                  <div className="h-32 sm:h-48 bg-gray-200 rounded mb-2 sm:mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-6 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex items-center justify-center px-2 sm:px-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Search Error</h2>
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex items-center justify-center px-2 sm:px-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">No Results Found</h2>
          <p className="text-gray-500">
            No products found for "{searchQuery}".
          </p>
          <div className="space-y-2">
            <p className="text-gray-500">Try:</p>
            <ul className="text-gray-500">
              <li>• Checking your spelling</li>
              <li>• Using more general terms</li>
              <li>• Using fewer keywords</li>
            </ul>
          </div>
          <Link
            to="/"
            className="inline-block px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-2 sm:gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Results for "{searchQuery}"
            <span className="text-gray-600 text-lg ml-2">
              ({products.length} items)
            </span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600'
                }`}
              >
                <IoGrid size={20} className="cursor-pointer" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600'
                }`}
              >
                <IoList size={20} className="cursor-pointer" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer w-full sm:w-auto"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white p-2 rounded-lg shadow-sm text-gray-600 hover:text-blue-600 sm:hidden transition-colors duration-200 w-full sm:w-auto"
            >
              <IoFilterSharp size={20} className="cursor-pointer" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Filters Sidebar */}
          <div
            className={`w-full sm:w-64 space-y-4 sm:space-y-6 ${
              showFilters ? 'block' : 'hidden sm:block'
            }`}
          >
            <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4">
              <h3 className="font-semibold text-gray-800 mb-2 sm:mb-4 text-sm sm:text-base">
                Price Range
              </h3>
              <div className="space-y-2 text-gray-600">
                <input
                  type="number"
                  name="min"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={handlePriceRangeChange}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="number"
                  name="max"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={handlePriceRangeChange}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={applyPriceFilter}
                  className="w-full px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer text-sm sm:text-base"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4">
              <h3 className="font-semibold text-gray-800 mb-2 sm:mb-4 text-sm sm:text-base">
                Brands
              </h3>
              <div className="space-y-2 max-h-32 sm:max-h-48 overflow-y-auto">
                {Array.from(new Set(products.map((p) => p.brandName))).map(
                  (brand) => (
                    <label key={brand} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrandFilter(brand)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 text-sm">{brand}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1 mb-4 sm:mb-10">
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                  : 'space-y-4'
              }
            >
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ${
                    viewMode === 'grid' ? 'p-2 sm:p-4' : 'p-2 sm:p-4 flex gap-4'
                  }`}
                >
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'space-y-2 sm:space-y-4 bg-white rounded shadow-md'
                        : 'flex-shrink-0 w-32 sm:w-48 bg-white rounded shadow-md'
                    }
                  >
                    <img
                      src={
                        product.productImage?.[0] ||
                        'https://via.placeholder.com/150'
                      }
                      alt={product.productName}
                      className={`w-full rounded-lg object-contain p-1 sm:p-2 mix-blend-multiply ${
                        viewMode === 'grid'
                          ? 'h-32 sm:h-50'
                          : 'h-24 sm:h-32 mt-2 sm:mt-10'
                      }`}
                      onError={(e) =>
                        (e.target.src = 'https://via.placeholder.com/150')
                      }
                    />
                  </div>

                  <div className="flex-1 space-y-1 sm:space-y-2">
                    <h3 className="font-medium text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base">
                      {product.productName}
                    </h3>
                    <p className="text-sm text-gray-500">{product.brandName}</p>

                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="flex items-center text-yellow-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar key={star} size={14} sm:size={16} />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">
                        (4.5)
                      </span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-lg font-bold text-gray-800">
                        ₹{product.selling}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.productPrice}
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        {Math.round(
                          ((product.productPrice - product.selling) * 100) /
                            product.productPrice
                        )}
                        % off
                      </span>
                    </div>

                    {viewMode === 'list' && (
                      <p className="text-gray-600 line-clamp-2 text-sm">
                        {product.productDescription ||
                          'No description available'}
                      </p>
                    )}

                    <div className="flex items-center gap-2 sm:gap-4 pt-1 sm:pt-2">
                      <button
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer text-sm sm:text-base"
                        onClick={(e) => {
                          handleAddToCart(e, product._id);
                        }}
                      >
                        <FaShoppingCart />
                        <span>Add to Cart</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toast.info('Wishlist functionality not implemented');
                        }}
                        className="text-gray-600 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                      >
                        <FaHeart size={16} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProduct;
