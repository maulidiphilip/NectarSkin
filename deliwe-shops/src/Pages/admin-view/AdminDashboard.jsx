// src/pages/AdminDashboard.jsx
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
import ProductsSection from "@/components/Admin/ProductsSection";
import OrdersSection from "@/components/Admin/OrdersSection";
import UsersSection from "@/components/Admin/UsersSection"; // Import the separate component
import AnalyticsSection from "@/components/Admin/AnalyticsSection";

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
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:w-60 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
          <Button
            variant="ghost"
            className="md:hidden p-2"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6 text-gray-900" />
          </Button>
        </div>
        <nav className="mt-4 flex-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                setActiveSection(item.path);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 ${
                activeSection === item.path ? "bg-amber-50 text-amber-600" : ""
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button
            onClick={handleLogout}
            className="w-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 md:pl-30">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden mb-4 p-2 fixed top-[4.5rem] left-4 z-50 bg-white rounded-full shadow"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="w-6 h-6 text-gray-900" />
        </Button>

        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:text-3xl">
          {navItems.find((item) => item.path === activeSection)?.name}
        </h1>

        {/* Dynamic Content */}
        <div className="space-y-6 max-w-7xl mx-auto">
          {activeSection === "products" && <ProductsSection />}
          {activeSection === "orders" && <OrdersSection />}
          {activeSection === "users" && <UsersSection />}
          {activeSection === "analytics" && <AnalyticsSection />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;