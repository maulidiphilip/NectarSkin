import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { fetchAllOrders, updateOrderStatus } from "@/store/Cart-Slice";

const OrdersSection = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.cart);
  const { role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (role === "admin") dispatch(fetchAllOrders());
  }, [dispatch, role]);

  const handleStatusUpdate = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  if (role !== "admin") return <div className="p-6 text-center text-red-500">Access denied.</div>;
  if (loading) return <div className="p-6 text-center text-gray-600">Loading orders...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Orders</h2>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <p className="text-gray-900 font-medium">Order #{order._id}</p>
                <p className="text-gray-600">
                  User ID: {order.userId} | Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Total: MWK{(order.totalPrice + 5.99).toFixed(2)}
                </p>
                <p className="text-gray-600">
                  Status:{" "}
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
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-amber-600 border-amber-600 hover:bg-amber-50"
                  onClick={() => handleStatusUpdate(order._id, "Pending Payment")}
                  disabled={order.status === "Pending Payment" || loading}
                >
                  Pending
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  onClick={() => handleStatusUpdate(order._id, "Payment Confirmed")}
                  disabled={order.status !== "Pending Payment" || loading}
                >
                  Confirm Payment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  onClick={() => handleStatusUpdate(order._id, "Shipped")}
                  disabled={order.status !== "Payment Confirmed" || loading}
                >
                  Shipped
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-purple-600 border-purple-600 hover:bg-purple-50"
                  onClick={() => handleStatusUpdate(order._id, "Delivered")}
                  disabled={order.status !== "Shipped" || loading}
                >
                  Delivered
                </Button>
              </div>
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