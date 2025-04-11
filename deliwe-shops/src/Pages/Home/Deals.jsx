import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Clock, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchPublicProducts } from "@/store/Product-slice";
import { addToCart, addToWishlist } from "@/store/Cart-Slice";
import toast from "react-hot-toast";

const Deals = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { cartLoading, wishlistLoading } = useSelector((state) => state.cart);
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

  useEffect(() => {
    dispatch(fetchPublicProducts());
  }, [dispatch]);

  useEffect(() => {
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

    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (productId) => {
    dispatch(addToCart({ productId, quantity: 1 })).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Added to cart! 🛒");
      }
    });
  };

  const handleAddToWishlist = (productId) => {
    dispatch(addToWishlist(productId)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Added to wishlist! ❤️");
      }
    });
  };

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

  const deals = products
    .filter((product) => product.oldPrice || product.stock > 0)
    .sort((a, b) => (b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0) - (a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0))
    .slice(0, 3);

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16 bg-gradient-to-b from-amber-50 to-white">
      {/* Header with Timer */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-2">
          🔥 Deals of the Day
          <span className="text-sm text-amber-600 animate-pulse">Limited Time!</span>
        </h2>
        <div className="flex items-center text-red-600 font-semibold mt-2 sm:mt-0">
          <Clock className="mr-2 animate-spin-slow" size={20} />
          <span>
            Ends in {timeLeft.hours.toString().padStart(2, "0")}h{" "}
            {timeLeft.minutes.toString().padStart(2, "0")}m{" "}
            {timeLeft.seconds.toString().padStart(2, "0")}s
          </span>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {deals.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">
            No deals available right now. Check back soon! ⏳
          </p>
        ) : (
          deals.map((deal) => (
            <div
              key={deal._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl relative flex flex-col min-h-[400px]" // Added min-h
            >
              {/* Discount Badge */}
              {deal.oldPrice && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{(((deal.oldPrice - deal.price) / deal.oldPrice) * 100).toFixed(0)}%
                </span>
              )}
              <Link to={`/product/${deal._id}`}>
                <img
                  src={deal.imageUrl || "https://via.placeholder.com/300"}
                  alt={deal.name}
                  className="w-full h-auto object-cover aspect-square" // Changed to h-auto and aspect-square
                />
              </Link>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900">{deal.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-amber-600 font-bold text-xl">
                    MWK {deal.price.toFixed(2)}
                  </span>
                  {deal.oldPrice && (
                    <span className="text-gray-500 line-through text-sm">
                      MWK {deal.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  {deal.stock > 0 ? (
                    deal.stock <= 5 ? (
                      <span className="text-red-500 font-semibold">Only {deal.stock} left!</span>
                    ) : (
                      `In Stock: ${deal.stock}`
                    )
                  ) : (
                    <span className="text-red-500">Sold Out</span>
                  )}
                </p>
                {/* Buttons */}
                <div className="mt-4 flex flex-col gap-2">
                  <Link to={`/product/${deal._id}`}>
                    <Button
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      disabled={deal.stock === 0}
                    >
                      {deal.stock > 0 ? "Grab Deal" : "Sold Out"}
                    </Button>
                  </Link>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 min-w-[120px] border-amber-600 text-amber-600 hover:bg-amber-100 flex items-center justify-center"
                      onClick={() => handleAddToCart(deal._id)}
                      disabled={deal.stock === 0 || cartLoading}
                    >
                      <ShoppingCart className="mr-2" size={16} />
                      {cartLoading ? "Adding..." : "Add to Cart"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 min-w-[120px] border-amber-600 text-amber-600 hover:bg-amber-100 flex items-center justify-center"
                      onClick={() => handleAddToWishlist(deal._id)}
                      disabled={wishlistLoading}
                    >
                      <Heart className="mr-2" size={16} />
                      {wishlistLoading ? "Adding..." : "Wishlist"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Shop More Button */}
      <div className="text-center mt-10">
        <Link to="/shop">
          <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-lg font-semibold">
            Explore More Deals 🎉
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Deals;