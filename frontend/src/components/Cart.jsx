/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartLogic } from '../helpers/cartLogic';
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaBookmark,
  FaShippingFast,
  FaPercent,
  FaTag,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import RazorpayButton from './RazorpayButton';
import Context from '../context';

const Cart = () => {
  const {
    cartItems,
    loading,
    error,
    handleQuantityChange,
    handleRemoveItem,
    subtotal,
    shipping,
    grandTotal,
  } = useCartLogic();

  const [isSuccess, setIsSuccess] = useState(false);
  const { fetchUserAddToCartProductCount } = useContext(Context);

  // Clear cart when isSuccess is true
  useEffect(() => {
    if (isSuccess) {
      Promise.all(cartItems.map((item) => handleRemoveItem(item._id)))
        .then(() => {
          fetchUserAddToCartProductCount();
          toast.success('Order placed successfully! Cart cleared.', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setIsSuccess(false); // Reset isSuccess after clearing
        })
        .catch((error) => {
          toast.error(
            'Failed to clear cart: ' + (error.message || 'Something went wrong')
          );
          console.error('Error clearing cart:', error);
        });
    }
  }, [isSuccess, cartItems, handleRemoveItem]);

  // Mock delivery dates (replace with API data if available)
  const getDeliveryDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const deliveryDate = getDeliveryDate();

  // Calculate total items for price detail
  const totalItems = cartItems.length;

  const calculateDiscount = () => {
    const originalPrice = cartItems.reduce(
      (total, item) =>
        total +
        ((item.productId.productPrice - item.productId.selling) *
          item.quantity || 0),
      0
    );
    return originalPrice;
  };

  const discount = calculateDiscount();
  const updatedGrandTotal = grandTotal;
  const savings = discount;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <h2 className="text-xl font-semibold text-gray-600">Loading Cart...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-800">Cart</h2>
        <p className="text-red-500 py-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-800">Cart</h2>
        <p className="text-gray-500 py-4">Your cart is empty.</p>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          My Cart ({totalItems} item{totalItems > 1 ? 's' : ''})
        </h2>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 mb-5">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    to={`/product/${item.productId._id}`}
                    className="w-48 h-48 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={
                        item.productId.productImage[0] ||
                        'https://via.placeholder.com/150'
                      }
                      alt={item.productId.productName}
                      className="w-full h-full object-contain mix-blend-multiply"
                      onError={(e) =>
                        (e.target.src = 'https://via.placeholder.com/150')
                      }
                    />
                  </Link>
                  <div className="flex-1 w-full">
                    <Link
                      to={`/product/${item.productId._id}`}
                      className="text-lg font-medium text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors"
                    >
                      {item.productId.productName || 'Unnamed Product'}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      Seller: {item.productId.seller || 'No Seller'}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-800">
                          ₹{item.productId.selling * item.quantity || 0}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.productId.productPrice * item.quantity || 0}
                        </span>
                        <span className="text-sm text-green-600">
                          {Math.round(
                            ((item.productId.productPrice -
                              item.productId.selling) /
                              item.productId.productPrice) *
                              100
                          )}
                          % Off
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-200 rounded-lg p-2 mt-2 sm:mt-0 border border-gray-300">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleQuantityChange(item._id, item.quantity - 1);
                          }}
                          className="px-2 py-1 text-blue-600 hover:text-blue-700 rounded-l-lg transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <FaMinus size={14} />
                        </button>
                        <span className="text-sm font-medium text-gray-800 mx-2">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleQuantityChange(item._id, item.quantity + 1);
                          }}
                          className="px-2 py-1 text-blue-600 hover:text-blue-700 rounded-r-lg transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <FaPlus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                      <p className="text-sm text-green-600">
                        Delivery by {deliveryDate} | ₹{shipping} Free
                      </p>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveItem(item._id);
                          }}
                          className="text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <FaTrash size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toast.info(
                              'Save for Later functionality not implemented yet'
                            );
                          }}
                          className="text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                          aria-label="Save for later"
                        >
                          <FaBookmark size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit mb-5">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Price Details
            </h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>
                  Price ({totalItems} item{totalItems > 1 ? 's' : ''})
                </span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- ₹{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-4 mt-4 flex justify-between text-lg font-bold text-gray-800">
                <span>Total Amount</span>
                <span>₹{updatedGrandTotal.toFixed(2)}</span>
              </div>
              <p className="text-green-600 text-sm mt-2">
                You will save ₹{savings.toFixed(2)} on this order
              </p>
              <RazorpayButton
                amount={subtotal}
                data={cartItems}
                shippingCharge={shipping}
                text="Proceed to Payment"
                setIsSuccess={setIsSuccess}
              />
              <Link
                to="/"
                className="block text-center text-blue-600 hover:text-blue-700 hover:underline mt-4 transition-colors cursor-pointer"
                aria-label="Continue Shopping"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
