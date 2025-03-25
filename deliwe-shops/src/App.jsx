import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home/Home";
import Footer from "./components/Footer";
import CartPage from "./Pages/Cart";
import Shop from "./Pages/Shop";
import ProductDetails from "./components/Products-Details";
import CheckoutPage from "./Pages/checkout";
import AuthPage from "./Pages/AuthPage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/shop" element={<Shop/>}/>
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/checkout" element={<CheckoutPage/>}/>
      <Route path="/auth" element={<AuthPage/>}/>
      </Routes>
      <Footer />
    </>
  );
}
