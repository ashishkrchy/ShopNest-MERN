/* eslint-disable no-unused-vars */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SummaryApi from '../common';
import {
  FaStar,
  FaStarHalf,
  FaShoppingCart,
  FaBolt,
  FaHeart,
  FaShare,
} from 'react-icons/fa';
import CategoryWiseProductDisplay from './CategoryWiseProductDetails';
import ProductReview from './ProductReview';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import RazorpayButton from './RazorpayButton';

const ProductDetail = () => {
  const { productId } = useParams();
  const [data, setData] = useState({
    productName: '',
    brandName: '',
    category: '',
    productImage: [],
    productDescription: '',
    productPrice: 0,
    selling: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0,
  });
  const [isZoomed, setIsZoomed] = useState(false);

  const productImageListLoading = new Array(5).fill(null);

  const discount =
    data.productPrice && data.selling
      ? Math.round(
          ((data.productPrice - data.selling) / data.productPrice) * 100
        )
      : 0;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${SummaryApi.getIndividualProduct.url}/${productId}`
        );
        const dataResponse = await response.json();

        if (dataResponse.success) {
          setData(dataResponse.data);
          setActiveImage(
            dataResponse.data.productImage[0] ||
              'https://via.placeholder.com/600'
          );
        } else {
          throw new Error(
            dataResponse.message || 'Failed to fetch product details'
          );
        }
      } catch (err) {
        setError(
          err.message || 'An error occurred while fetching product details'
        );
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const { fetchUserAddToCartProductCount } = useContext(Context);
  const handleAddToCart = useCallback(
    async (e, id) => {
      await addToCart(e, id);
      await fetchUserAddToCartProductCount();
    },
    [fetchUserAddToCartProductCount]
  );

  const handleImageSelect = (imageUrl) => {
    setActiveImage(imageUrl);
    setIsZoomed(false);
  };

  const handleZoomImage = useCallback(
    (e) => {
      if (!activeImage) return;

      const { left, top, width, height } = e.target.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;

      setZoomImageCoordinate({ x, y });
      setIsZoomed(true);
    },
    [activeImage]
  );

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8 bg-gray-100">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 py-4">
          Loading Product Details...
        </h2>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full">
            <div className="flex flex-row lg:flex-col gap-2 sm:gap-4 overflow-x-auto lg:overflow-y-auto lg:h-[400px] scrollbar-none">
              {productImageListLoading.map((_, index) => (
                <div
                  className="h-16 w-16 sm:h-20 sm:w-20 bg-gray-200 rounded flex-shrink-0"
                  key={index}
                  aria-hidden="true"
                />
              ))}
            </div>
            <div className="h-[250px] sm:h-[400px] w-full lg:w-[600px] bg-gray-200 rounded-lg shadow" />
          </div>

          <div className="flex flex-col gap-4 w-full lg:w-1/2">
            <div className="h-6 bg-gray-200 rounded w-24" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="space-y-3">
              <div className="flex items-baseline gap-4">
                <div className="h-8 bg-gray-200 rounded w-16" />
                <div className="h-6 bg-gray-200 rounded w-14" />
                <div className="h-6 bg-gray-200 rounded w-12" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 my-4">
              <div className="h-10 bg-gray-200 rounded w-full sm:w-28" />
              <div className="h-10 bg-gray-200 rounded w-full sm:w-28" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-100">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 py-4">
          Product Details
        </h2>
        <p className="text-red-500 text-center py-4">{error}</p>
        <Link
          to="/"
          className="block text-center text-blue-600 hover:text-blue-700 hover:underline"
        >
          Go Back to Home
        </Link>
      </div>
    );
  }

  if (!data.productName) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-100">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 py-4">
          Product Details
        </h2>
        <p className="text-gray-500 text-center py-4">
          No product data available.
        </p>
        <Link
          to="/"
          className="block text-center text-blue-600 hover:text-blue-700 hover:underline"
        >
          Go Back to Home
        </Link>
      </div>
    );
  }

  // Format product data as an array for RazorpayButton
  const productData = [
    {
      productId: data._id, // Assuming data has an _id field from the backend
      quantity: 1, // Default quantity for a single product purchase
      price: data.selling, // Selling price for this product
    },
  ];

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 bg-gray-100">
      <div className="min-h-[200px] flex flex-col lg:flex-row gap-4 sm:gap-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 w-full">
          {/* Mobile Thumbnail Strip */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 scrollbar-none">
            {data?.productImage?.map((imageUrl, index) => (
              <div
                className="h-16 w-16 sm:h-20 sm:w-20 bg-gray-200 rounded flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200"
                key={index}
              >
                <img
                  src={imageUrl || 'https://via.placeholder.com/80'}
                  alt={`${data.productName} thumbnail ${index + 1}`}
                  className="w-full h-full object-contain rounded cursor-pointer mix-blend-multiply"
                  onClick={() => handleImageSelect(imageUrl)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80';
                  }}
                />
              </div>
            ))}
          </div>

          {/* Desktop Thumbnail Strip */}
          <div className="hidden lg:block h-[400px] w-20">
            <div className="flex flex-col gap-4 overflow-y-auto scrollbar-none h-full">
              {data?.productImage?.map((imageUrl, index) => (
                <div
                  className="h-20 w-20 bg-white rounded cursor-pointer hover:scale-105 transition-transform duration-200"
                  key={index}
                >
                  <img
                    src={imageUrl || 'https://via.placeholder.com/80'}
                    alt={`${data.productName} thumbnail ${index + 1}`}
                    className="w-full h-full object-contain rounded cursor-pointer mix-blend-multiply p-1"
                    onMouseEnter={() => handleImageSelect(imageUrl)}
                    onClick={() => handleImageSelect(imageUrl)}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Main Image */}
          <div className="flex flex-col lg:flex-row gap-4 relative">
            <div className="h-[250px] sm:h-[400px] w-full lg:w-[550px] bg-white rounded-lg shadow-md relative overflow-hidden">
              <img
                src={activeImage || 'https://via.placeholder.com/600'}
                alt={data.productName}
                className="w-full h-full object-contain rounded-lg transition-transform duration-200 hover:scale-105 cursor-zoom-in mix-blend-multiply p-2"
                onMouseEnter={handleZoomImage}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleZoomImage}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600';
                }}
              />
            </div>

            {/* Zoomed Image (Desktop only) */}
            {isZoomed && activeImage && (
              <div className="hidden lg:block absolute left-[630px] top-0 w-[660px] h-[630px] bg-gray-200 p-2 rounded-lg shadow-xl z-50 border border-gray-300">
                <div
                  className="w-full h-full rounded-lg transition-transform duration-200"
                  style={{
                    backgroundImage: `url(${activeImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover', // Use 'cover' for better quality
                    backgroundPosition: `${zoomImageCoordinate.x}% ${zoomImageCoordinate.y}%`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-4 sm:gap-6 w-full lg:w-1/2">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-base sm:text-lg font-semibold bg-green-500 px-2 py-1 rounded inline-block text-gray-900">
                  {data?.brandName || 'No Brand'}
                </p>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
                  {data?.productName || 'Unnamed Product'}
                </h1>
                <p className="text-base sm:text-lg text-gray-500 capitalize">
                  {data?.category || 'Uncategorized'}
                </p>
              </div>
              <div className="flex gap-2 sm:gap-4">
                <button className="text-gray-600 hover:text-blue-600 transition-colors hover:scale-110 duration-200">
                  <FaShare size={20} />
                </button>
                <button className="text-gray-600 hover:text-red-600 transition-colors hover:scale-110 duration-200">
                  <FaHeart size={20} />
                </button>
              </div>
            </div>

            <div className="text-yellow-500 flex items-center gap-1">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalf />
              <span className="text-xs sm:text-sm text-gray-500 ml-2">
                4.0 | 50 Ratings & 50 Reviews
              </span>
            </div>

            <div className="space-y-2 sm:space-y-4">
              <div className="flex items-baseline gap-2 sm:gap-4">
                <span className="text-2xl sm:text-4xl font-bold text-gray-800">
                  ₹{data.selling || 0}
                </span>
                {data.productPrice > 0 && (
                  <span className="text-base sm:text-xl text-gray-500 line-through">
                    ₹{data.productPrice}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-base sm:text-xl text-green-600 font-semibold">
                    {discount}% off
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-lg text-gray-500">
                <span>Free delivery by Tomorrow</span>
                <span className="text-blue-600 font-medium">
                  Express Delivery
                </span>
              </div>
            </div>

            {/* Buy Now and Add to Cart Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 my-4 sm:my-6">
              <div className="w-full sm:w-auto">
                <RazorpayButton
                  amount={data.selling}
                  data={[
                    {
                      productId: {
                        _id: data._id,
                        selling: data.selling,
                        productImage: data.productImage,
                        productName: data.productName,
                      },
                      quantity: 1,
                    },
                  ]}
                  shippingCharge={0}
                  text="Buy Now"
                ></RazorpayButton>
              </div>
              <button
                className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 min-w-[140px] font-medium rounded-lg hover:bg-blue-700 transition-transform duration-200 hover:scale-105 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                onClick={(e) => handleAddToCart(e, productId)}
              >
                <FaShoppingCart /> Add to Cart
              </button>
            </div>

            <div className="space-y-4 pt-4 sm:pt-6 border-t border-gray-300">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Specifications
              </h2>
              <div className="bg-gray-100 p-3 sm:p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="text-gray-700 font-medium">Brand</div>
                  <div className="text-gray-500">{data.brandName || 'N/A'}</div>
                  <div className="text-gray-700 font-medium">Category</div>
                  <div className="text-gray-500 capitalize">
                    {data.category || 'Uncategorized'}
                  </div>
                  <div className="text-gray-700 font-medium">Model</div>
                  <div className="text-gray-500">
                    {data.productName || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 sm:pt-6 border-t border-gray-300 pb-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Description
              </h2>
              <p className="text text-gray-500 leading-relaxed p-3 bg-gray-100 shadow-md rounded sm:p-4">
                {data?.productDescription || 'No description available.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add the Reviews Component */}
      <ProductReview productId={productId} />

      <CategoryWiseProductDisplay
        category={data.category}
        heading="Similar Products"
      />
    </div>
  );
};

export default ProductDetail;
