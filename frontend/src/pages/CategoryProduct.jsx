/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import productCategory from '../helpers/productCategory';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { IoFilterSharp, IoGrid, IoList } from 'react-icons/io5';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const CategoryProduct = () => {
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = useState([category]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch category products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.filterProduct.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categories: selectedCategories,
          brands: selectedBrands,
          minPrice: priceRange.min ? parseFloat(priceRange.min) : 0,
          maxPrice: priceRange.max ? parseFloat(priceRange.max) : Infinity,
          sortBy,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('response: ', result);
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch products');
      }

      setProducts(result.data || []);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((cat) => cat !== value)
    );
  };

  const handleSelectBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    fetchProducts();
  };

  const resetFilters = () => {
    setSelectedCategories([category]);
    setSelectedBrands([]);
    setPriceRange({ min: '', max: '' });
    setSortBy('relevance');
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, [category, sortBy, selectedCategories]);

  const { fetchUserAddToCartProductCount } = useContext(Context);
  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    await fetchUserAddToCartProductCount();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="h-48 bg-gray-200 rounded mb-4" />
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
      <div className="min-h-screen bg-gray-100 pt-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Category Error</h2>
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            No Products Found
          </h2>
          <p className="text-gray-500">
            No products found for &quot;{category}&quot;.
          </p>
          <div className="space-y-2">
            <p className="text-gray-500">Try:</p>
            <ul className="text-gray-500">
              <li>• Checking your filters</li>
              <li>• Using different sorting options</li>
              <li>• Adjusting price range</li>
            </ul>
          </div>
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 mb-3">
      <div className="max-w-7xl mx-auto">
        {/* Header and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-col w-full sm:w-auto items-start sm:items-center gap-2 py-3 px-2 rounded">
            <h2 className="text-2xl font-semibold text-gray-800">
              Total Results: ({products.length} Products)
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600'
                }`}
              >
                <IoGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600'
                }`}
              >
                <IoList size={20} />
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white p-2 rounded-lg shadow-sm text-gray-600 hover:text-blue-600 sm:hidden w-full sm:w-auto transition-colors duration-200"
            >
              <IoFilterSharp size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Filters Sidebar */}
          <div
            className={`w-full sm:w-64 space-y-6 ${
              showFilters ? 'block' : 'hidden sm:block'
            }`}
          >
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Price Range</h3>
              <div className="space-y-2 text-gray-600">
                <input
                  type="number"
                  name="min"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={handlePriceRangeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  name="max"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={handlePriceRangeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <div className="flex gap-2">
                  <button
                    onClick={applyFilters}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                  >
                    Apply
                  </button>
                  <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Category</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {productCategory.map((cat, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.value)}
                      onChange={(e) => handleSelectCategory(e)}
                      value={cat.value}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
              <h3 className="font-semibold text-gray-800 mb-4">Brands</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Array.from(new Set(products.map((p) => p.brandName)))
                  .filter((brand) => brand)
                  .map((brand, index) => (
                    <label key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleSelectBrand(brand)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{brand}</span>
                    </label>
                  ))}
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                  : 'space-y-4'
              }
            >
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 ${
                    viewMode === 'grid' ? '' : 'flex gap-4'
                  }`}
                >
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'space-y-4 bg-gray-200 rounded shadow-md'
                        : 'flex-shrink-0 w-48 h-48 flex items-center shadow-md bg-gray-100 rounded'
                    }
                  >
                    <img
                      src={
                        product.productImage?.[0] ||
                        'https://via.placeholder.com/150'
                      }
                      alt={product.productName}
                      className={`w-full rounded-lg object-contain mix-blend-multiply ${
                        viewMode === 'grid' ? 'h-48' : 'h-32'
                      }`}
                      onError={(e) =>
                        (e.target.src = 'https://via.placeholder.com/150')
                      }
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-medium text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors duration-200 mt-1.5">
                      {product.productName}
                    </h3>
                    <p className="text-sm text-gray-500">{product.brandName}</p>
                    <div className="flex items-center gap-2 text-yellow-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} size={16} />
                      ))}
                      <span className="text-sm text-gray-500">(4.5)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-800">
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
                        % Off
                      </span>
                    </div>
                    {viewMode === 'list' && (
                      <p className="text-gray-600 line-clamp-2">
                        {product.description || 'No description available'}
                      </p>
                    )}
                    <div className="flex items-center gap-4 pt-2">
                      <button
                        onClick={(e) => {
                          handleAddToCart(e, product._id);
                        }}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                      >
                        <FaShoppingCart />
                        <span className="text-sm">Add to Cart</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toast.info('Wishlist functionality not implemented');
                        }}
                        className="text-gray-600 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                      >
                        <FaHeart size={20} />
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

export default CategoryProduct;
