/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(SummaryApi.adminOrders.url, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        if (!data.orders || !Array.isArray(data.orders)) {
          throw new Error('Invalid orders data');
        }
        setOrders(data.orders);
      } catch (error) {
        toast.error('Failed to load orders!');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-100 min-h-screen rounded">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📦 Admin - Manage Orders
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No orders available.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 transition-shadow duration-200 hover:shadow-lg"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  Order ID: {order._id}
                </h3>
                <p className="text-gray-600">
                  Status: {order.paymentDetails?.payment_status || 'Pending'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">User: {order.email || 'N/A'}</p>
                  <p className="text-gray-600">
                    Shipping Charge: ₹{order.shipping_charge || 0}
                  </p>
                  <p className="text-gray-600">
                    Total: ₹{order.totalPayment || 0}
                  </p>
                  <p className="text-gray-600">
                    Payment Date:{' '}
                    {order.paymentDetails?.payment_date || 'Not available'}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-gray-700 mb-2">Products:</h4>
                {order.productDetails?.map((product, index) => (
                  <div
                    key={`${product.productID}_${index}`}
                    className="flex items-center gap-4 mt-2 p-3 bg-gray-100 shadow-md rounded-lg"
                  >
                    <img
                      src={
                        product.image?.[0] || 'https://via.placeholder.com/48'
                      }
                      alt={product.productName || 'Product'}
                      className="w-16 h-16 rounded object-contain border border-gray-200 shadow-md p-1"
                      onError={(e) => {
                        e.target.className =
                          'w-16 h-16 rounded object-contain bg-gray-100 border border-gray-300';
                      }}
                      loading="lazy"
                    />
                    <div>
                      <p className="text-sm text-gray-800 font-medium">
                        {product.productName || 'Unnamed Product'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {product.quantity || 1} | Price: ₹
                        {product.price || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
