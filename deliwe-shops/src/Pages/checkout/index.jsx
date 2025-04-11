import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, fetchOrders, fetchCart } from "@/store/Cart-Slice";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Load Stripe with the key from .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ clientSecret, orderData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentError, setPaymentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      setPaymentError(error.message);
    } else if (paymentIntent.status === "succeeded") {
      const result = await dispatch(createOrder({ ...orderData, paymentIntentId: paymentIntent.id }));
      if (result.meta.requestStatus === "fulfilled") {
        await dispatch(fetchOrders());
        await dispatch(fetchCart());
        navigate("/order-confirmation");
      } else {
        setPaymentError("Order creation failed after payment");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="p-3 border rounded-lg mb-4 bg-white" />
      {paymentError && <p className="text-red-500 mb-4">{paymentError}</p>}
      <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={!stripe}>
        Pay Now
      </Button>
    </form>
  );
};

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { totalPrice, loading, error } = useSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [stripeData, setStripeData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const paymentInstructions = {
    Mo626: "Send the amount to National Bank of Malawi (account details TBD) and email proof to your-email@yahoo.com or WhatsApp to 0991103578.",
    Mpamba: "Send the amount to 0880000200 via Mpamba and email proof to your-email@yahoo.com or WhatsApp to 0991103578.",
    "Airtel Money": "Send the amount to 0991103578 via Airtel Money and email proof to your-email@yahoo.com or WhatsApp to 0991103578.",
    Stripe: "Proceed to pay instantly with your card.",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === "Stripe") {
      const result = await dispatch(createOrder({ paymentMethod, shippingAddress }));
      if (result.payload?.clientSecret) {
        setStripeData(result.payload);
      }
    } else {
      const result = await dispatch(createOrder({ paymentMethod, shippingAddress }));
      if (result.meta.requestStatus === "fulfilled") {
        await dispatch(fetchOrders());
        await dispatch(fetchCart());
        navigate("/order-confirmation");
      }
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>
          {!stripeData ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Address</h3>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <input
                  type="text"
                  name="addressLine1"
                  value={shippingAddress.addressLine1}
                  onChange={handleInputChange}
                  placeholder="Address Line 1"
                  className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <input
                  type="text"
                  name="addressLine2"
                  value={shippingAddress.addressLine2}
                  onChange={handleInputChange}
                  placeholder="Address Line 2 (Optional)"
                  className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  placeholder="State/Province (Optional)"
                  className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                  placeholder="Postal Code"
                  className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <input
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Method</h3>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="Mo626">Mo626</option>
                  <option value="Mpamba">Mpamba</option>
                  <option value="Airtel Money">Airtel Money</option>
                  <option value="Stripe">Instant Pay</option>
                </select>
                {paymentMethod && paymentMethod !== "Stripe" && (
                  <p className="text-gray-600 text-sm">{paymentInstructions[paymentMethod]}</p>
                )}
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-6">
                Total: MWK {totalPrice.toFixed(2)}
              </p>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                {paymentMethod === "Stripe" ? "Proceed to Payment" : "Place Order"}
              </Button>
            </form>
          ) : (
            <Elements stripe={stripePromise}>
              <CheckoutForm clientSecret={stripeData.clientSecret} orderData={stripeData.order} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;