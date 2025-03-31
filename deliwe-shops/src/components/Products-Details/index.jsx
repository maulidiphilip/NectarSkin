// src/components/ProductDetails.js
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProductById } from "@/store/Product-slice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading) {
    return <div className="min-h-screen pt-24 px-6 text-center">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-6 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen pt-24 px-6 text-center text-gray-600">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row gap-12">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <img
            src={currentProduct.imageUrl || "https://via.placeholder.com/400"}
            alt={currentProduct.name}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900">{currentProduct.name}</h1>
          <p className="text-gray-600 mt-3">{currentProduct.description}</p>

          {/* Price */}
          <div className="flex items-center mt-4">
            <span className="text-amber-600 font-bold text-2xl">
              MWK{currentProduct.price.toFixed(2)}
            </span>
            {currentProduct.oldPrice && (
              <span className="text-gray-500 line-through ml-2 text-lg">
                MWK{currentProduct.oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock */}
          <p className="text-gray-600 mt-2">
            {currentProduct.stock > 0 ? (
              `In Stock: ${currentProduct.stock}`
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </p>

          {/* Quantity Selector */}
          <div className="mt-6 flex items-center">
            <span className="mr-3 text-gray-700">Quantity:</span>
            <input
              type="number"
              min="1"
              max={currentProduct.stock > 0 ? currentProduct.stock : 1}
              defaultValue="1"
              className="border px-3 py-1 w-16 text-center rounded-lg"
              disabled={currentProduct.stock === 0}
            />
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full bg-amber-600 hover:bg-amber-700 text-white mt-6"
            disabled={currentProduct.stock === 0}
          >
            <ShoppingCart className="mr-2" size={18} />
            {currentProduct.stock > 0 ? "Add to Cart" : "Sold Out"}
          </Button>

          {/* Back to Shop */}
          <Link
            to="/shop"
            className="text-amber-600 hover:underline mt-4 inline-block flex items-center"
          >
            <Button variant="outline">
              <ArrowLeft className="mr-2" size={18} /> Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;