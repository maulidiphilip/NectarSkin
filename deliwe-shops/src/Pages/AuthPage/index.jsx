// src/components/AuthPage.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { login, register } from "@/store/Auth-slice";
import { syncCart } from "@/store/Cart-Slice";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { loading, error, role, token } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/";

  useEffect(() => {
    if (token && role) {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        if (cartItems.length > 0) {
          dispatch(syncCart(cartItems))
            .unwrap()
            .then(() => navigate(redirectPath))
            .catch((err) => console.error("Cart sync failed:", err));
        } else {
          navigate(redirectPath);
        }
      }
    }
  }, [token, role, cartItems, navigate, redirectPath, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      const loginData = { userEmail: formData.userEmail, password: formData.password };
      dispatch(login(loginData));
    } else {
      const registerData = {
        userName: formData.userName,
        userEmail: formData.userEmail,
        password: formData.password,
      };
      dispatch(register(registerData));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-28">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          {isLogin ? "Login to Checkout" : "Create Account to Checkout"}
        </h2>
        <p className="text-gray-500 text-center mt-2">
          {isLogin ? "Sign in to complete your purchase" : "Register to proceed with checkout"}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-gray-700 font-medium">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-amber-300"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700 font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-amber-300"
              value={formData.userEmail}
              onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-amber-300"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            {isLogin ? "Login & Checkout" : "Register & Checkout"}
          </Button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <p className="text-center text-gray-600 text-sm mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-amber-600 font-semibold hover:underline"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;