// src/components/CartPage.js
import { useEffect } from "react";
import { ShoppingCart, X, Plus, Minus, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { deleteFromCart, fetchCart, setLocalCart, updateCart } from "@/store/Cart-Slice";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, loading, error } = useSelector((state) => state.cart);
  const isAuthenticated = !!localStorage.getItem("token");
  const shipping = 2999.99;

  useEffect(() => {
    dispatch(fetchCart())
      .unwrap()
      .catch((err) => {
        console.error("Failed to fetch cart:", err);
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        dispatch(setLocalCart(localCart));
      });
  }, [dispatch]);

  const updateQuantity = (productId, type) => {
    const item = cartItems.find((item) => item.productId === productId);
    const newQuantity = type === "increase" ? item.quantity + 1 : item.quantity - 1;
    if (newQuantity >= 0) {
      dispatch(updateCart({ productId, quantity: newQuantity }));
    }
  };

  const removeItem = (productId) => {
    dispatch(deleteFromCart(productId));
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.productId?.price || item.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/auth", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Button>
            <Link to="/shop" className="text-amber-600 hover:text-amber-800 transition-colors flex items-center">
              <ArrowLeft className="w-6 h-6 sm:mr-2" />
              <span className="hidden sm:inline">Continue Shopping</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="mr-2" size={28} />
            Your Cart
          </h1>
          <div className="w-10"></div>
        </div>

        {cartItems.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {cartItems.map((item) => (
              <div
                key={item.productId || item.id}
                className="flex flex-col sm:flex-row items-center p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-all"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden mr-4 mb-4 sm:mb-0">
                  <img
                    src={item.productId?.imageUrl || item.image || "https://via.placeholder.com/80"}
                    alt={item.productId?.name || item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-gray-900">{item.productId?.name || item.name}</h3>
                  <p className="text-amber-600 font-bold">MWK{(item.productId?.price || item.price || 0).toFixed(2)}</p>
                </div>
                <div className="flex items-center mt-4 sm:mt-0">
                  <button
                    onClick={() => updateQuantity(item.productId || item.id, "decrease")}
                    className="p-2 text-gray-600 hover:text-amber-600 transition-colors"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="mx-3 w-8 text-center text-lg">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId || item.id, "increase")}
                    className="p-2 text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex items-center mt-4 sm:mt-0 ml-0 sm:ml-6">
                  <p className="font-semibold text-gray-900 text-lg mr-6">
                    MWK{((item.productId?.price || item.price || 0) * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId || item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg font-medium mt-10">Your cart is empty.</p>
        )}

        {cartItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-semibold">MWK{subtotal.toFixed(2)}</span>
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
              onClick={handleCheckout}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
            >
              Proceed to Checkout
            </Button>
            <p className="text-center text-gray-500 text-sm mt-4">
              🎉 Free shipping on orders over MWK50,000!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;