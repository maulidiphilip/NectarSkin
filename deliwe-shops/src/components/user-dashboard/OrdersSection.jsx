import React from "react";
import { Button } from "@/components/ui/button";

const OrdersSection = () => {
  // Mock data (replace with Redux/API data later)
  const orders = [
    { id: "ORD001", date: "2025-04-08", total: 59.99, status: "Delivered" },
    { id: "ORD002", date: "2025-04-05", total: 29.99, status: "Shipped" },
  ];

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Order History</h2>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded-lg">
              <p>
                <span className="font-medium">Order ID:</span> {order.id}
              </p>
              <p>
                <span className="font-medium">Date:</span> {order.date}
              </p>
              <p>
                <span className="font-medium">Total:</span> ${order.total.toFixed(2)}
              </p>
              <p>
                <span className="font-medium">Status:</span> {order.status}
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                View Details
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrdersSection;