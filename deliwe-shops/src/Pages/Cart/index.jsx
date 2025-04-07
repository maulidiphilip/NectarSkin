import { useState } from "react";
import { ShoppingCart, X, Plus, Minus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import lotion from "../../assets/instagram-3.jpg";
import { Button } from "@/components/ui/button";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Lavender Body Lotion", price: 6999.99, quantity: 2, image: lotion },
    { id: 2, name: "Charcoal Face Wash", price: 4999.50, quantity: 1, image: lotion },
    { id: 3, name: "Rose Quartz Soap Bar", price: 10999.99, quantity: 3, image: lotion },
  ]);

  const shipping = 5.99;

  // Function to update item quantity
  const updateQuantity = (id, type) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: type === "increase" ? item.quantity + 1 : item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0) // Remove item if quantity reaches 0
    );
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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

        {/* Cart Items */}
        {cartItems.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-all">
                {/* Product Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden mr-4 mb-4 sm:mb-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Product Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-amber-600 font-bold">MWK{item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center mt-4 sm:mt-0">
                  <button onClick={() => updateQuantity(item.id, "decrease")} className="p-2 text-gray-600 hover:text-amber-600 transition-colors">
                    <Minus size={18} />
                  </button>
                  <span className="mx-3 w-8 text-center text-lg">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, "increase")} className="p-2 text-gray-600 hover:text-amber-600 transition-colors">
                    <Plus size={18} />
                  </button>
                </div>

                {/* Subtotal & Remove */}
                <div className="flex items-center mt-4 sm:mt-0 ml-0 sm:ml-6">
                  <p className="font-semibold text-gray-900 text-lg mr-6">
                    MWK{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button onClick={() => updateQuantity(item.id, "decrease")} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg font-medium mt-10">Your cart is empty.</p>
        )}

        {/* Order Summary */}
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

            <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-md hover:shadow-lg">
              <Link to="/checkout">Proceed to Checkout</Link>
            </button>

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
