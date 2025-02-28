/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { Link } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        setLoading(true);
        const response = await fetch(SummaryApi.getProductCategoryList.url);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
          const categoryMap = {};
          result.data.forEach((product) => {
            if (!categoryMap[product.category]) {
              categoryMap[product.category] =
                product.productImage[0] || 'https://via.placeholder.com/150';
            }
          });

          const categoryArray = Object.keys(categoryMap).map((key) => ({
            name: key,
            image: categoryMap[key],
          }));

          setCategories(categoryArray);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryList();
  }, []);

  const getCircleSize = () => {
    if (windowWidth >= 1280) return '6.2vw';
    if (windowWidth >= 768) return '5.8vw';
    if (windowWidth >= 640) return '4.3vw';
    return '4vw';
  };

  const circleSize = getCircleSize();

  if (loading) {
    return (
      <div className="bg-gray-200 py-2 px-4 sm:px-6 lg:px-8 shadow-md mt-2">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 overflow-scroll scrollbar-none whitespace-nowrap">
            {Array.from({ length: 13 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-gray-300 rounded-full shadow-md"
                  style={{ width: circleSize, height: circleSize }}
                />
                <div className="mt-2 h-4 w-16 bg-gray-300 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-gray-200 py-2 px-4 sm:px-6 lg:px-8 shadow-md mt-2">
        <div className="container mx-auto">
          <p className="text-center text-gray-500 py-4">
            No categories available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 py-2 px-4 sm:px-6 lg:px-8 shadow-md mt-2">
      <div className="container mx-auto">
        <div className="flex items-center gap-4 overflow-scroll scrollbar-none whitespace-nowrap">
          {categories.map((category, index) => (
            <Link
              to={`/category-product/${category?.name}`}
              key={index}
              className="flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform duration-200"
            >
              <div
                className="bg-white rounded-full flex items-center justify-center shadow-md"
                style={{ width: circleSize, height: circleSize }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="rounded-full object-contain"
                  style={{
                    width: `calc(${circleSize} - 8px)`,
                    height: `calc(${circleSize} - 8px)`,
                  }} // Slightly smaller than container for padding
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150'; // Fallback if image fails to load
                  }}
                />
              </div>
              <p
                className="text-sm font-medium text-gray-800 mt-2 capitalize text-center w-full truncate"
                style={{ maxWidth: circleSize }}
              >
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
