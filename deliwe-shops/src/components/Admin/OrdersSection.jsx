// src/components/OrdersSection.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchAllOrders, updateOrderStatus } from "@/store/Cart-Slice";
import { Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const OrdersSection = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.cart);
  const { role } = useSelector((state) => state.auth);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (role === "admin") dispatch(fetchAllOrders());
  }, [dispatch, role]);

  useEffect(() => {
    console.log("Orders in Redux:", orders); // Debug log
  }, [orders]);

  const handleStatusUpdate = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Filter orders based on status and search term
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    const matchesSearch = order.userId?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || !searchTerm;
    return matchesStatus && matchesSearch;
  });

  if (role !== "admin") return <div className="p-6 text-center text-red-500">Access denied. You must be an admin to view this page.</div>;
  if (loading) return <div className="p-6 text-center text-gray-600">Loading orders, please wait...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Oops, something went wrong: {error}</div>;

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Management</h2>

      {/* Filter Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-amber-300 focus:border-amber-600"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-amber-300 focus:border-amber-600">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Pending Payment">Pending Payment</SelectItem>
              <SelectItem value="Payment Confirmed">Payment Confirmed</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              {/* Summary Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">Order #{order._id.slice(-6)}</p>
                  <p className="text-gray-700">
                    Customer: <span className="font-medium">{order.userId?.userName || "Unknown Customer"}</span>
                  </p>
                  <p className="text-gray-700">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    Total: MWK{((order.totalPrice || 0) + 5.99).toFixed(2)} (including shipping)
                  </p>
                  <p className="text-gray-700">
                    Status:{" "}
                    <span
                      className={
                        order.status === "Delivered"
                          ? "text-green-600 font-medium"
                          : order.status === "Shipped"
                          ? "text-blue-600 font-medium"
                          : order.status === "Pending Payment"
                          ? "text-amber-600 font-medium"
                          : "text-gray-600 font-medium"
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
                    Set to Pending
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
                    Mark as Shipped
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-purple-600 border-purple-600 hover:bg-purple-50"
                    onClick={() => handleStatusUpdate(order._id, "Delivered")}
                    disabled={order.status !== "Shipped" || loading}
                  >
                    Mark as Delivered
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => toggleExpand(order._id)}
                  >
                    <Eye className="mr-2" size={16} />
                    {expandedOrders[order._id] ? "Hide Details" : "View Details"}
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrders[order._id] && (
                <div className="mt-4 p-4 bg-amber-50 rounded-lg text-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Customer Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
                      <p>
                        <strong>Name:</strong> {order.userId?.userName || "Unknown"}
                      </p>
                      <p>
                        <strong>Email:</strong> {order.userId?.email || "Not provided"}
                      </p>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
                      {order.shippingAddress ? (
                        <>
                          <p>{order.shippingAddress.street}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                          <p>{order.shippingAddress.country}</p>
                        </>
                      ) : (
                        <p className="text-gray-500">No shipping address provided</p>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="col-span-full">
                      <h3 className="text-lg font-semibold text-gray-900">Items Ordered</h3>
                      {order.items && order.items.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {order.items.map((item, index) => (
                            <li key={index}>
                              {item.productId?.name || "Unknown Product"} - {item.quantity} x MWK{(item.price || 0).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No items listed</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No orders match your search or filter.</p>
      )}
    </div>
  );
};

export default OrdersSection;