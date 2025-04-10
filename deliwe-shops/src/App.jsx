import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { checkAuth } from "@/store/Auth-slice";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home/Home";
import Footer from "./components/Footer";
import CartPage from "./Pages/Cart";
import Shop from "./Pages/Shop";
import ProductDetails from "./components/Products-Details";
import CheckoutPage from "./Pages/checkout";
import AuthPage from "./Pages/AuthPage";
import AdminDashboard from "./Pages/admin-view/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDashboard from "./Pages/Customer-view/UserDashboard";
import OrderConfirmation from "./Pages/OrderConfirmation";
import OrderDetail from "./components/user-dashboard/OrderDetail";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<div className="text-center pt-24">404 - Page Not Found</div>} />
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRole="user" />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order/:orderId" element={<OrderDetail />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}