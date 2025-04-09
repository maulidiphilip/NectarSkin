// src/pages/OrderDetail.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchOrders } from "@/store/Cart-Slice";

const OrderDetail = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) dispatch(fetchOrders());
  }, [dispatch, user]);

  const order = orders.find((o) => o._id === orderId);

  if (!user) return <div className="min-h-screen pt-24 px-6 text-center">Please log in.</div>;
  if (loading) return <div className="min-h-screen pt-24 px-6 text-center">Loading...</div>;
  if (error) return <div className="min-h-screen pt-24 px-6 text-center text-red-500">Error: {error}</div>;
  if (!order) return <div className="min-h-screen pt-24 px-6 text-center">Order not found.</div>;

  const shipping = 5.99;
  const total = order.totalPrice + shipping;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Order #{order._id}</h1>
        <div className="bg-white shadow-lg rounded-xl p-6">
          <p className="mb-2">
            <span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="mb-2">
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
          <p className="mb-4">
            <span className="font-medium">Payment Method:</span> {order.paymentMethod}
          </p>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{item.productId.name}</p>
                  <p className="text-gray-600">MWK{item.priceAtPurchase.toFixed(2)} x {item.quantity}</p>
                </div>
                <p className="font-semibold">MWK{(item.priceAtPurchase * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-semibold">MWK{order.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Shipping</span>
              <span className="font-semibold">MWK{shipping.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-4 flex justify-between">
              <span className="text-gray-900 font-bold text-lg">Total</span>
              <span className="text-amber-600 font-bold text-xl">MWK{total.toFixed(2)}</span>
            </div>
          </div>
          <Button
            asChild
            className="mt-6 bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Link to="/user/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;