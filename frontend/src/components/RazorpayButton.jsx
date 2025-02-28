/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common/index.js';
import { FaBolt } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const RazorpayButton = ({
  amount,
  data,
  shippingCharge,
  text,
  setIsSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    let script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => console.log('Razorpay script loaded');
    script.onerror = () =>
      toast.error('Failed to load Razorpay', { theme: 'dark' });

    document.body.appendChild(script);

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      toast.error('Invalid payment amount!', { theme: 'dark' });
      return;
    }

    setLoading(true);
    try {
      const products = data.map((item) => ({
        id: item?.productId?._id,
        name: item?.productId?.productName,
        quantity: item.quantity,
        price: item?.productId?.selling || 0,
        image: item?.productId?.productImage,
      }));

      const response = await fetch(SummaryApi.payment.url, {
        method: SummaryApi.payment.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount, shippingCharge, products }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Razorpay order');
      }

      const order = await response.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.order.amount,
        currency: order.order.currency,
        name: 'ShopNest',
        description: 'Purchase Payment',
        order_id: order.order.id,
        handler: async (response) => {
          toast.success(
            `Payment successful! ID: ${response.razorpay_payment_id}`,
            { theme: 'dark' }
          );

          const verifyResponse = await fetch(SummaryApi.verifyPayment.url, {
            method: SummaryApi.verifyPayment.method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyResult = await verifyResponse.json();

          if (verifyResult.success) {
            setIsSuccess(true);
            toast.success('Order verified successfully!', { theme: 'dark' });
          } else {
            toast.error('Payment verification failed!', { theme: 'dark' });
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phoneNumber,
        },
        theme: { color: 'blue' },
        modal: {
          backdropClose: false,
          escape: false,
        },
      };

      try {
        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', (error) => {
          toast.error(
            `Payment failed! Reason: ${error.error.reason || 'Unknown'}`,
            { theme: 'dark' }
          );
        });

        rzp.open();
      } catch (error) {
        toast.error('Unable to initialize Razorpay. Please try again.', {
          theme: 'dark',
        });
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed. Try again.', {
        theme: 'dark',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`px-4 py-2 rounded-lg shadow-md transition-all duration-300 justify-center 
        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        ${
          text === 'Buy Now'
            ? 'bg-blue-600 text-white sm:px-6 sm:py-3 min-w-[140px] font-medium hover:bg-blue-700 cursor-pointer '
            : 'w-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
        }`}
      aria-label={loading ? 'Processing payment...' : text}
    >
      {loading ? (
        'Processing...'
      ) : (
        <span className="flex items-center gap-2">
          <FaBolt className="text-white" />
          <span className="mx-auto">{text}</span>
        </span>
      )}
    </button>
  );
};

export default RazorpayButton;
