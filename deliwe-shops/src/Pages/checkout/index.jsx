// src/pages/CheckoutPage.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, CheckCircle, Printer, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchCart, createOrder } from "@/store/Cart-Slice";

const paymentOptions = [
  { id: "mo626", name: "Mo626", details: "Send payment to Account: 1005689337" },
  { id: "mpamba", name: "Mpamba", details: "Send payment to Phone: 0881511200" },
  { id: "airtel", name: "Airtel Money", details: "Send payment to Phone: 0991103578" },
];

const CheckoutPage = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const shipping = 5.99;
  const total = totalPrice + shipping;

  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [dispatch, user]);

  const handleConfirmOrder = () => {
    if (!selectedPayment) {
      alert("Please select a payment method."); // Replace with toast later
      return;
    }
    const paymentMethod = paymentOptions.find((p) => p.id === selectedPayment)?.name;
    dispatch(createOrder(paymentMethod))
      .unwrap()
      .then(() => navigate("/order-confirmation"))
      .catch((err) => console.error("Order creation failed:", err));
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (!user) return <div className="min-h-screen pt-24 px-6 text-center">Please log in to checkout.</div>;
  if (loading) return <div className="min-h-screen pt-24 px-6 text-center">Loading...</div>;
  if (error) return <div className="min-h-screen pt-24 px-6 text-center text-red-500">Error: {error}</div>;
  if (items.length === 0) return (
    <div className="min-h-screen pt-24 px-6 text-center">
      <p className="text-gray-600">Your cart is empty.</p>
      <Link to="/shop" className="text-amber-600 hover:underline">Shop Now</Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 px-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/cart" className="text-amber-600 hover:text-amber-800 flex items-center">
            <ArrowLeft className="mr-2" size={20} />
            <span className="hidden sm:inline">Back to Cart</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Choose Payment Method</h2>
        <div className="mt-4 space-y-3">
          {paymentOptions.map((option) => (
            <div
              key={option.id}
              className={`p-4 rounded-lg border cursor-pointer ${
                selectedPayment === option.id ? "border-amber-600 bg-amber-50" : "border-gray-300"
              } transition`}
              onClick={() => setSelectedPayment(option.id)}
            >
              <h3 className="font-medium text-gray-800">{option.name}</h3>
              <p className="text-sm text-gray-600">{option.details}</p>
            </div>
          ))}
        </div>

        {selectedPayment && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-start">
            <CheckCircle size={24} className="mr-3" />
            <p>
              Please send <strong>MWK{total.toFixed(2)}</strong> to{" "}
              <strong>{paymentOptions.find((p) => p.id === selectedPayment)?.details}</strong> and send a screenshot of the
              transaction to WhatsApp or email: <strong>philipmaulidi@yahoo.com</strong> for confirmation.
            </p>
          </div>
        )}

        <div className="mt-6">
          <Button
            onClick={handleConfirmOrder}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2"
            disabled={!selectedPayment || loading}
          >
            Confirm Order
          </Button>
        </div>

        <div className="mt-4">
          <Button
            onClick={handlePrintReceipt}
            variant="outline"
            className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            <Printer size={18} /> Print Receipt
          </Button>
        </div>

        <div className="mt-4">
          <a
            href="https://wa.me/265991103578"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} /> Live Chat Support (WhatsApp)
          </a>
        </div>

        <div className="mt-6">
          <button className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2">
            <Lock size={18} /> Pay with PayChangu (Coming Soon)
          </button>
          <p className="text-center text-gray-500 text-sm mt-2">Online payments will be available soon.</p>
        </div>

        <p className="text-center text-gray-700 text-sm mt-6">
          Your order will be processed once payment is confirmed.
        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;