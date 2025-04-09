// src/components/OrdersSection.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchOrders } from "@/store/Cart-Slice";

const OrdersSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) dispatch(fetchOrders());
  }, [dispatch, user]);

  if (loading) return <div className="p-6 text-center text-gray-600">Loading orders...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Order History</h2>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg">
              <p>
                <span className="font-medium">Order ID:</span> {order._id}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Total:</span> MWK{(order.totalPrice + 5.99).toFixed(2)}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={
                    order.status === "Delivered"
                      ? "text-green-600"
                      : order.status === "Shipped"
                      ? "text-blue-600"
                      : order.status === "Pending Payment"
                      ? "text-amber-600"
                      : "text-gray-600"
                  }
                >
                  {order.status}
                </span>
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-amber-600 border-amber-600 hover:bg-amber-50"
                onClick={() => navigate(`/order/${order._id}`)}
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No orders found.</p>
      )}
    </div>
  );
};

export default OrdersSection;