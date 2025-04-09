// src/pages/CartPage.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, X, Plus, Minus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCart, updateCartItem, removeFromCart } from "@/store/Cart-Slice"; 

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const shipping = 5.99;

  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [dispatch, user]);

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity > 0) {
      dispatch(updateCartItem({ productId, quantity }));
    } else {
      dispatch(removeFromCart({ productId }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart({ productId }));
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (!user) return <div className="min-h-screen pt-24 px-6 text-center">Please log in to view your cart.</div>;
  if (loading) return <div className="min-h-screen pt-24 px-6 text-center">Loading cart...</div>;
  if (error) return (
    <div className="min-h-screen pt-24 px-6 text-center">
      <p className="text-red-500">Error: {error}</p>
      <Button onClick={() => dispatch(fetchCart())} className="mt-4">Retry</Button>
    </div>
  );

  const total = totalPrice !== null && totalPrice !== undefined ? totalPrice + shipping : shipping;

  console.log("Cart items:", items); // Debug log

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Button variant="ghost">
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

        {items.length > 0 && items.every(item => item.productId && typeof item.productId.price === "number") ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {items.map((item) => (
              <div
                key={item.productId._id}
                className="flex flex-col sm:flex-row items-center p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-all"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden mr-4 mb-4 sm:mb-0">
                  <img
                    src={item.productId.imageUrl || "https://via.placeholder.com/100"}
                    alt={item.productId.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-gray-900">{item.productId.name}</h3>
                  <p className="text-amber-600 font-bold">MWK{item.productId.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center mt-4 sm:mt-0">
                  <button
                    onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
                    className="p-2 text-gray-600 hover:text-amber-600 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="mx-3 w-8 text-center text-lg">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
                    className="p-2 text-gray-600 hover:text-amber-600 transition-colors disabled:opacity-50"
                    disabled={loading || item.productId.stock <= item.quantity}
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex items-center mt-4 sm:mt-0 ml-0 sm:ml-6">
                  <p className="font-semibold text-gray-900 text-lg mr-6">
                    MWK{(item.productId.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.productId._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg font-medium mt-10">Your cart is empty or invalid.</p>
        )}

        {items.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-semibold">MWK{(totalPrice || 0).toFixed(2)}</span>
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
              disabled={loading || items.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;