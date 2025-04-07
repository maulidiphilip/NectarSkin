import { useState } from "react";
import { ArrowLeft, Lock, CheckCircle, Printer, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const paymentOptions = [
    { id: "mo626", name: "Mo626", details: "Send payment to Account: 1005689337" },
    { id: "mpamba", name: "Mpamba", details: "Send payment to Phone: 0881511200" },
    { id: "airtel", name: "Airtel Money", details: "Send payment to Phone: 0991103578" },
];

const CheckoutPage = () => {
    const [selectedPayment, setSelectedPayment] = useState(null);
    const total = 94.97; // Example total amount

    // Print receipt function
    const handlePrintReceipt = () => {
        window.print();
    };

    return (
        <div className="min-h-screen pt-24 px-6 bg-gray-100">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Link to="/cart" className="text-amber-600 hover:text-amber-800 flex items-center">
                        <ArrowLeft className="mr-2" size={20} />
                        <span className="hidden sm:inline">Back to Cart</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
                </div>

                {/* Payment Selection */}
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Choose Payment Method</h2>
                <div className="mt-4 space-y-3">
                    {paymentOptions.map((option) => (
                        <div
                            key={option.id}
                            className={`p-4 rounded-lg border cursor-pointer ${selectedPayment === option.id ? "border-amber-600 bg-amber-50" : "border-gray-300"
                                } transition`}
                            onClick={() => setSelectedPayment(option.id)}
                        >
                            <h3 className="font-medium text-gray-800">{option.name}</h3>
                            <p className="text-sm text-gray-600">{option.details}</p>
                        </div>
                    ))}
                </div>

                {/* Confirmation Message */}
                {selectedPayment && (
                    <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-start">
                        <CheckCircle size={24} className="mr-3" />
                        <p>
                            Please send <strong>MWK{total.toFixed(2)}</strong> to{" "}
                            <strong>{paymentOptions.find((p) => p.id === selectedPayment)?.details}</strong> and send a screenshot of the
                            transaction to WhatsApp or email:{" "}
                            <strong>philipmaulidi@yahoo.com</strong> for confirmation.
                        </p>
                    </div>
                )}

                {/* Print Receipt Button */}
                <div className="mt-6">
                    <Button onClick={handlePrintReceipt} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                        <Printer size={18} /> Print Receipt
                    </Button>
                </div>

                {/* Live Chat Support Button */}
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

                {/* Future Online Payment */}
                <div className="mt-6">
                    <button className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2">
                        <Lock size={18} /> Pay with PayChangu (Coming Soon)
                    </button>
                    <p className="text-center text-gray-500 text-sm mt-2">Online payments will be available soon.</p>
                </div>

                {/* Order Confirmation */}
                <p className="text-center text-gray-700 text-sm mt-6">
                    Your order will be processed once payment is confirmed.
                </p>
            </div>
        </div>
    );
};

export default CheckoutPage;
