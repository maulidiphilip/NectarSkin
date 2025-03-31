// src/components/FeaturedProducts.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchPublicProducts } from "@/store/Product-slice";

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchPublicProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="text-center">Loading products...</div>
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

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-16">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900 font-serif">
          Best Sellers
        </h2>
        <p className="text-gray-600 mt-2">
          Discover the most loved products by our customers.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">
            No products available yet.
          </p>
        ) : (
          products.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <img
                src={product.imageUrl || "https://via.placeholder.com/300"}
                alt={product.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="text-amber-600 font-bold text-xl mt-2">
                  MWK{product.price.toFixed(2)}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {product.stock > 0 ? (
                    `In Stock: ${product.stock}`
                  ) : (
                    <span className="text-red-500">Out of Stock</span>
                  )}
                </p>
                <Button
                  className="mt-4 w-full bg-amber-600 hover:bg-amber-700"
                  disabled={product.stock === 0} // Disable button if out of stock
                >
                  {product.stock > 0 ? "Buy Now" : "Sold Out"}
                </Button>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;