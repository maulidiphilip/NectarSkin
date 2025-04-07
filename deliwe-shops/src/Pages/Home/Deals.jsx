// src/components/Deals.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchPublicProducts } from "@/store/Product-slice";

const Deals = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  
  // State for countdown timer (example: 24 hours from now)
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Fetch products from backend
    dispatch(fetchPublicProducts());
  }, [dispatch]);

  useEffect(() => {
    // Countdown timer logic
    const endTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (loading) {
    return (
      <section className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="text-center">Loading deals...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="text-center text-red-500">Error: {error}</div>
      </section>
    );
  }

  // Filter for "deals" (e.g., products with oldPrice or high discount)
  const deals = products
    .filter((product) => product.oldPrice || product.stock > 0) // Example filter
    .slice(0, 3); // Limit to 3 deals

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">🔥 Deals of the Day</h2>
        <div className="flex items-center text-red-600">
          <Clock className="mr-2" />
          <span>
            Ends in {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {deals.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">
            No deals available right now.
          </p>
        ) : (
          deals.map((deal) => (
            <div
              key={deal._id}
              className="bg-white rounded-lg shadow-md overflow-hidden p-4 transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <img
                src={deal.imageUrl || "https://via.placeholder.com/300"}
                alt={deal.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{deal.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-amber-600 font-bold text-xl">
                    MWK{deal.price.toFixed(2)}
                  </span>
                  {deal.oldPrice && (
                    <span className="text-gray-500 line-through">
                      MWK{deal.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  {deal.stock > 0 ? (
                    `Only ${deal.stock} left!`
                  ) : (
                    <span className="text-red-500">Sold Out</span>
                  )}
                </p>
                {deal.oldPrice && (
                  <p className="text-green-600 text-sm mt-1">
                    Save {(((deal.oldPrice - deal.price) / deal.oldPrice) * 100).toFixed(0)}%
                  </p>
                )}
                <Button
                  className="mt-4 w-full bg-amber-600 hover:bg-amber-700"
                  disabled={deal.stock === 0}
                >
                  {deal.stock > 0 ? "Grab Deal" : "Sold Out"}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Shop More Button */}
      <div className="text-center mt-10">
        <Link to="/shop">
          <Button className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 text-lg">
            Shop More Deals
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Deals;