/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import SummaryApi from '../common';

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(SummaryApi.adminAnalyticsDashboard.url, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error(error);
        setError('Failed to load analytics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 rounded max-h-[calc(100vh-100px)] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        📊 Admin Analytics
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          title="💰 Total Revenue"
          value={`₹${data?.totalRevenue || 0}`}
        />
        <StatCard title="📦 Total Orders" value={data?.totalOrders || 0} />
        <StatCard title="🚚 Pending Orders" value={data?.pendingOrders || 0} />
        <StatCard
          title="✅ Completed Orders"
          value={data?.completedOrders || 0}
        />
        <StatCard title="👥 Total Users" value={data?.totalUsers || 0} />
        <StatCard
          title="🆕 New Users (This Month)"
          value={data?.newUsersThisMonth || 0}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Payment Methods Pie Chart */}
        <ChartCard title="💳 Payment Methods">
          <Pie
            data={{
              labels: data?.paymentMethods?.map((item) => item._id) || [],
              datasets: [
                {
                  data: data?.paymentMethods?.map((item) => item.count) || [],
                  backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
                },
              ],
            }}
          />
        </ChartCard>

        {/* Best Selling Products Bar Chart */}
        <ChartCard title="🏆 Best-Selling Products">
          <Bar
            data={{
              labels: data?.bestSellingProducts?.map((item) => item._id) || [],
              datasets: [
                {
                  label: 'Units Sold',
                  data:
                    data?.bestSellingProducts?.map((item) => item.totalSold) ||
                    [],
                  backgroundColor: '#4CAF50',
                },
              ],
            }}
          />
        </ChartCard>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-200">
    <h4 className="text-sm font-semibold text-gray-600">{title}</h4>
    <p className="text-xl font-bold text-gray-800">{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
    <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
    {children}
  </div>
);

const LoadingSkeleton = () => (
  <div className="p-6 text-center bg-gray-100">
    <p className="text-gray-500">🔄 Loading analytics...</p>
  </div>
);

export default AdminAnalytics;
