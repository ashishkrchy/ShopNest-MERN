/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { FaStar, FaStarHalf, FaFilter, FaThumbsUp } from 'react-icons/fa';
import productReviews from '../helpers/productReview';

const ProductReview = ({ productId }) => {
  const [ratingStats, setRatingStats] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
    average: 0,
    total: 0,
  });
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);

  const [newReview, setNewReview] = useState({
    reviewerName: '',
    rating: 5,
    comment: '',
    review: '',
    verified: false,
    helpful: 0,
    date: new Date().toISOString().split('T')[0],
  });
  const [showForm, setShowForm] = useState(false);
  const reviewsPerPage = 5;

  useEffect(() => {
    if (!productReviews.length) return;

    let total = productReviews.length;
    let sum = 0;
    let counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    productReviews.forEach(({ rating }) => {
      counts[rating] = (counts[rating] || 0) + 1;
      sum += rating;
    });

    setRatingStats({
      ...counts,
      average: total ? sum / total : 0,
      total,
    });
  }, []);

  const handleRatingFilter = (rating) => {
    console.log('Selected Rating:', rating);
    setSelectedRating(rating.toString());
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++)
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    if (hasHalfStar)
      stars.push(<FaStarHalf key="half-star" className="text-yellow-500" />);
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++)
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);

    return stars;
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const newReviewId = productReviews.length + 1;
    const reviewToAdd = {
      ...newReview,
      [e.target.name]: [e.target.value],
      id: newReviewId,
      date: newReview.date || new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [...productReviews, reviewToAdd];

    setNewReview(updatedReviews);
    productReviews.push(newReview);

    let total = updatedReviews.length;
    let sum = 0;
    let counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    updatedReviews.forEach(({ rating }) => {
      counts[rating] = (counts[rating] || 0) + 1;
      sum += rating;
    });

    setRatingStats({
      ...counts,
      average: total ? sum / total : 0,
      total,
    });

    setNewReview({
      reviewerName: '',
      rating: 5,
      comment: '',
      review: '',
      verified: false,
      helpful: 0,
      date: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  const filteredReviews = productReviews.filter(
    (review) =>
      selectedRating === 'all' || review.rating === Number(selectedRating)
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'helpful') return (b.helpful || 0) - (a.helpful || 0);
    return 0;
  });

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Ratings & Reviews
      </h2>

      {/* Rating Summary and Write Review Button */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 mb-8 p-4 bg-white rounded-lg shadow-md">
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center w-full sm:w-1/3 md:w-1/4 p-4 border-b sm:border-b-0 sm:border-r border-gray-200">
          <div className="text-5xl font-bold text-gray-800 mb-2">
            {ratingStats.average.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mb-2">
            {renderStars(ratingStats.average)}
          </div>
          <p className="text-gray-500 text-sm">{ratingStats.total} ratings</p>
        </div>

        {/* Rating Bars */}
        <div className="w-full sm:w-2/3 md:w-2/4 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-2">
              <button
                onClick={() => handleRatingFilter(stars)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                {stars} <FaStar className="text-yellow-500" />
              </button>
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all duration-200"
                  style={{
                    width: `${(ratingStats[stars] / ratingStats.total) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm text-gray-500">
                {ratingStats[stars]}
              </span>
            </div>
          ))}
        </div>

        {/* Write Review Button */}
        <div className="w-full sm:w-1/3 md:w-1/4 flex flex-col items-center justify-center">
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Write Review Form (Modal-like) */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Write Your Review
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={newReview.reviewerName}
                  onChange={(e) =>
                    setNewReview({ ...newReview, reviewerName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      rating: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-800"
                  required
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Stars
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <input
                  type="text"
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Review
                </label>
                <textarea
                  value={newReview.review}
                  onChange={(e) =>
                    setNewReview({ ...newReview, review: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-800 h-24 resize-none"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <FaFilter className="text-gray-500" />
        <span className="text-gray-700 font-medium">Filter by:</span>
        {['all', 5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => handleRatingFilter(rating)}
            className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
              selectedRating === rating.toString()
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {rating === 'all' ? 'All' : `${rating} Stars`}
          </button>
        ))}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="ml-auto px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {/* Reviews List */}
      {paginatedReviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800">
                {review.reviewerName}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                {renderStars(review.rating)}{' '}
                <span className="ml-2">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button className="text-gray-500 hover:text-blue-600">
              Report
            </button>
          </div>
          <p className="text-gray-700 mt-2">{review.comment}</p>
          {review.review && (
            <p className="text-gray-500 text-sm mt-2 italic">{review.review}</p>
          )}
        </div>
      ))}

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-sm'
            } transition-colors duration-200`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductReview;
