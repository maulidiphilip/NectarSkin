// src/Pages/admin-view/AdminDashboard.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/Auth-slice";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  Users,
  BarChart,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  const navItems = [
    { name: "Products", icon: <Package className="w-5 h-5" />, path: "products" },
    { name: "Orders", icon: <ShoppingCart className="w-5 h-5" />, path: "orders" },
    { name: "Users", icon: <Users className="w-5 h-5" />, path: "users" },
    { name: "Analytics", icon: <BarChart className="w-5 h-5" />, path: "analytics" },
  ];

  const [activeSection, setActiveSection] = useState("products");

  return (
    <div className="min-h-screen bg-gray-100 flex pt-[4.5rem]">
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 w-60 bg-white shadow-lg md:static transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
          <Button variant="ghost" className="md:hidden p-2" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-900" />
          </Button>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                setActiveSection(item.path);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 ${activeSection === item.path ? "bg-amber-50 text-amber-600" : ""
                }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button onClick={handleLogout} className="w-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-2">
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:text-3xl">
          {navItems.find((item) => item.path === activeSection)?.name}
        </h1>

        <div className="space-y-6 max-w-4xl mx-auto">
          {activeSection === "products" && <ProductsSection />}
          {activeSection === "orders" && <OrdersSection />}
          {activeSection === "users" && <UsersSection />}
          {activeSection === "analytics" && <AnalyticsSection />}
        </div>
      </main>
    </div>

  );
};

// Placeholder Sections
const ProductsSection = () => (
  <div className="bg-white shadow-lg rounded-xl p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Products</h2>
    <div className="space-y-4">
      <Button className="bg-amber-600 hover:bg-amber-700">Add New Product</Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <h3 className="font-medium text-gray-900">Sample Product</h3>
          <p className="text-gray-600">$29.99</p>
          <Button variant="outline" className="mt-2">Edit</Button>
        </div>
      </div>
    </div>
  </div>
);

const OrdersSection = () => (
  <div className="bg-white shadow-lg rounded-xl p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Orders</h2>
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <p className="text-gray-900 font-medium">Order #1234</p>
        <p className="text-gray-600">Status: Shipped</p>
        <Button variant="outline" className="mt-2">View Details</Button>
      </div>
    </div>
  </div>
);

const UsersSection = () => (
  <div className="bg-white shadow-lg rounded-xl p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Users</h2>
    <div className="space-y-4">
      <Button className="bg-amber-600 hover:bg-amber-700">View All Users</Button>
      <div className="border rounded-lg p-4">
        <p className="text-gray-900 font-medium">Takondwa Maulidi</p>
        <p className="text-gray-600">Role: Admin</p>
        <Button variant="outline" className="mt-2">Edit Role</Button>
      </div>
    </div>
  </div>
);

const AnalyticsSection = () => (
  <div className="bg-white shadow-lg rounded-xl p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics Overview</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="border rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-amber-600">150</p>
        <p className="text-gray-600">Total Sales</p>
      </div>
      <div className="border rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-amber-600">45</p>
        <p className="text-gray-600">Pending Orders</p>
      </div>
      <div className="border rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-amber-600">300</p>
        <p className="text-gray-600">Users</p>
      </div>
    </div>
  </div>
);

export default AdminDashboard;