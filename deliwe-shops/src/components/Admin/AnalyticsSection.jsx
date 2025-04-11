// src/components/Admin/AnalyticsSection.jsx
import { fetchAnalytics } from "@/store/Analytics-Slice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AnalyticsSection = () => {
  const dispatch = useDispatch();
  const { totalUsers, totalOrders, pendingOrders, totalRevenue, topProducts, loading, error } =
    useSelector((state) => state.analytics);
  const { role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (role === "admin") {
      dispatch(fetchAnalytics());
    }
  }, [dispatch, role]);

  if (role !== "admin") return <div className="p-6 text-center text-red-500">Access denied.</div>;
  if (loading) return <div className="p-6 text-center text-gray-600">Loading analytics...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{totalRevenue.toFixed(2)} MWK</p>
          <p className="text-gray-600">Total Revenue</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{totalOrders}</p>
          <p className="text-gray-600">Total Orders</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{pendingOrders}</p>
          <p className="text-gray-600">Pending Orders</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{totalUsers}</p>
          <p className="text-gray-600">Total Users</p>
        </div>
      </div>

      {/* Top Products */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Selling Products</h3>
        {topProducts.length > 0 ? (
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div
                key={product._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded-lg p-4"
              >
                <div>
                  <p className="text-gray-900 font-medium">{product.name}</p>
                  <p className="text-gray-600">Units Sold: {product.totalSold}</p>
                </div>
                <p className="text-amber-600 font-semibold">
                  Revenue: {product.totalRevenue.toFixed(2)} MWK
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No sales data available.</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsSection;