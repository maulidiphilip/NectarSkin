// src/pages/OrderConfirmation.js
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const OrderConfirmation = () => {
  const { lastOrder } = useSelector((state) => state.cart);
  const shipping = 5.99;
  
  if (!lastOrder) {
    return (
      <div className="min-h-screen pt-24 px-6 bg-gray-50 text-center">
        <p className="text-gray-600">No order found. Please place an order first.</p>
        <Link to="/shop" className="text-amber-600 hover:underline mt-4 inline-block">Continue Shopping</Link>
      </div>
    );
  }

  const total = lastOrder.totalPrice + shipping;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-6 flex items-center justify-center">
          <ShoppingCart className="mr-2" size={28} />
          Order Placed Successfully!
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Thank you for your purchase. Your order #{lastOrder._id} is {lastOrder.status}.
        </p>
        {lastOrder.status === "Pending Payment" && (
          <p className="text-center text-amber-600 mb-8">
            Please send MWK{total.toFixed(2)} via {lastOrder.paymentMethod} and submit proof to{" "}
            <strong>philipmaulidi@yahoo.com</strong> or WhatsApp.
          </p>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Details</h2>
          <div className="space-y-4">
            {lastOrder.items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium text-gray-900">{item.productId.name}</p>
                  <p className="text-gray-600">MWK{item.priceAtPurchase.toFixed(2)} x {item.quantity}</p>
                </div>
                <p className="font-semibold">MWK{(item.priceAtPurchase * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-semibold">MWK{lastOrder.totalPrice.toFixed(2)}</span>
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
            className="mt-6 w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          >
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;