/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import SummaryApi from '../common';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const ArrowButton = ({ onClick, direction }) => (
  <button
    onClick={onClick}
    className={`absolute ${
      direction === 'left' ? 'left-2 md:left-4' : 'right-2 md:right-4'
    } top-1/2 -translate-y-1/2 z-10 bg-gray-200/80 p-3 rounded-full shadow-lg hover:bg-gray-300 transition-colors flex items-center justify-center cursor-pointer`}
    aria-label={direction === 'left' ? 'Previous slide' : 'Next slide'}
  >
    {direction === 'left' ? (
      <FaChevronLeft className="text-gray-600 text-xl hover:text-gray-800" />
    ) : (
      <FaChevronRight className="text-gray-600 text-xl hover:text-gray-800" />
    )}
  </button>
);

const VerticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { fetchUserAddToCartProductCount } = useContext(Context);

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

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    await fetchUserAddToCartProductCount();
  };

  const getDiscount = (productPrice, sellingPrice) => {
    return productPrice && sellingPrice
      ? Math.round(((productPrice - sellingPrice) / productPrice) * 100)
      : 0;
  };

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <ArrowButton direction="right" />,
    prevArrow: <ArrowButton direction="left" />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="container mx-auto px-4 my-5">
      <h2 className="text-2xl font-semibold py-4 text-gray-800">{heading}</h2>
      {loading ? (
        <p className="text-center text-gray-600">Loading {heading}...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-500">
          No products found in this category.
        </p>
      ) : (
        <Slider {...settings} className="w-full">
          {data.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="w-full px-2"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-[260px] md:w-[300px] h-[380px] bg-white rounded-lg shadow-md flex flex-col items-center p-4 hover:shadow-lg transition-all duration-300">
                <div className="w-full h-48 bg-white shadow rounded-md flex items-center justify-center overflow-hidden mb-3">
                  <img
                    src={
                      product.productImage[0] ||
                      'https://via.placeholder.com/150'
                    }
                    alt={product.productName}
                    className="w-full h-full object-contain rounded-md mix-blend-multiply p-1"
                    onError={(e) =>
                      (e.target.src = 'https://via.placeholder.com/150')
                    }
                  />
                </div>
                <div className="text-center w-full">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                    {product.productName || 'Unnamed Product'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.brandName || 'No Brand'}
                  </p>
                  <div className="flex justify-center items-center gap-2 mt-2">
                    <span className="text-base font-bold text-gray-800">
                      ₹{product.selling || 0}
                    </span>
                    {product.productPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        ₹{product.productPrice}
                      </span>
                    )}
                    {getDiscount(product.productPrice, product.selling) > 0 && (
                      <span className="text-xs font-medium text-green-600">
                        {getDiscount(product.productPrice, product.selling)}%
                        off
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={(e) => handleAddToCart(e, product?._id)}
                >
                  Add to Cart
                </button>
              </div>
            </Link>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default VerticalCardProduct;
