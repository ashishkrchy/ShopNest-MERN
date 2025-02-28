/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-gray-200/80 p-2 md:p-3 rounded-full shadow-lg hover:bg-gray-300 transition-colors flex items-center justify-center cursor-pointer"
    aria-label="Previous slide"
  >
    <FaChevronLeft className="text-gray-600 text-base md:text-xl hover:text-gray-800" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-gray-200/80 p-2 md:p-3 rounded-full shadow-lg hover:bg-gray-300 transition-colors flex items-center justify-center cursor-pointer"
    aria-label="Next slide"
  >
    <FaChevronRight className="text-gray-600 text-base md:text-xl hover:text-gray-800" />
  </button>
);

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadingList = new Array(8).fill(null);

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
      <div className="container mx-auto px-4 my-5">
        <h2 className="text-2xl font-semibold py-4 text-gray-600">
          Loading {heading}...
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {loadingList.map((_, index) => (
            <div
              key={index}
              className="w-full h-36 bg-gray-200 rounded-lg shadow flex flex-col p-4"
            >
              <div className="w-full h-24 bg-gray-300 rounded-md mb-2"></div>
              <div className="space-y-2">
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
      <div className="container mx-auto px-4 my-5">
        <h2 className="text-2xl font-semibold py-4 text-gray-600">{heading}</h2>
        <p className="text-red-500 text-center py-4">Error: {error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="container mx-auto px-4 my-5">
        <h2 className="text-2xl font-semibold py-4 text-gray-600">{heading}</h2>
        <p className="text-gray-500 text-center py-4">
          No products found in this category.
        </p>
      </div>
    );
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          arrows: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: true,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 my-5">
      <h2 className="text-2xl font-semibold py-4 text-gray-800">{heading}</h2>
      <div className="relative w-full">
        <Slider {...settings} className="w-full">
          {data.map((product, index) => {
            const discount = getDiscount(product.productPrice, product.selling);
            return (
              <Link
                to={`/product/${product._id}`}
                key={product._id || index}
                className="w-full px-2"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <div className="w-[280px] md:w-[320px] h-36 bg-white rounded-lg shadow-md flex items-center p-4 hover:shadow-lg transition-colors duration-200">
                  <div className="w-32 h-24 bg-white shadow rounded-md flex items-center justify-center overflow-hidden mr-4">
                    <img
                      src={
                        product.productImage[0] ||
                        'https://via.placeholder.com/150'
                      }
                      alt={product.productName}
                      className="w-full h-full object-contain rounded-md mix-blend-multiply p-1"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                        {product.productName || 'Unnamed Product'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {product.brandName || 'No Brand'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-base font-bold text-gray-800">
                          ₹{product.selling || 0}
                        </span>
                        {product.productPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            ₹{product.productPrice}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="text-xs font-medium text-green-600">
                            {discount}% off
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                      onClick={(e) => handleAddToCart(e, product?._id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default HorizontalCardProduct;
