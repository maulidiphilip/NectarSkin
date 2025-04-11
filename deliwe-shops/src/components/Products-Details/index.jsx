import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProductById } from "@/store/Product-slice";
import { addToCart, addToWishlist } from "@/store/Cart-Slice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, loading, error } = useSelector((state) => state.products);
  const { cartLoading, cartError, wishlistLoading, wishlistError } = useSelector((state) => state.cart);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (currentProduct.stock >= quantity) {
      dispatch(addToCart({ productId: currentProduct._id, quantity }));
    }
  };

  const handleAddToWishlist = () => {
    dispatch(addToWishlist(currentProduct._id));
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(currentProduct.stock, Number(e.target.value)));
    setQuantity(value);
  };

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
    <div className="min-h-screen bg-gray-100 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row gap-8 py-8">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <img
            src={currentProduct.imageUrl || "https://via.placeholder.com/400"}
            alt={currentProduct.name}
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900">{currentProduct.name}</h1>
          <p className="text-gray-600 mt-3 leading-relaxed">{currentProduct.description}</p>

          <div className="flex items-center mt-4">
            <span className="text-amber-600 font-bold text-2xl">
              MWK {currentProduct.price.toFixed(2)}
            </span>
            {currentProduct.oldPrice && (
              <span className="text-gray-500 line-through ml-3 text-lg">
                MWK {currentProduct.oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-gray-600 mt-2">
            {currentProduct.stock > 0 ? (
              `In Stock: ${currentProduct.stock}`
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </p>

          <div className="mt-6 flex items-center">
            <span className="mr-3 text-gray-700 font-medium">Quantity:</span>
            <input
              type="number"
              min="1"
              max={currentProduct.stock > 0 ? currentProduct.stock : 1}
              value={quantity}
              onChange={handleQuantityChange}
              className="border px-3 py-2 w-16 text-center rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={currentProduct.stock === 0}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center"
              onClick={handleAddToCart}
              disabled={currentProduct.stock === 0 || cartLoading}
            >
              <ShoppingCart className="mr-2" size={18} />
              {cartLoading ? "Adding..." : currentProduct.stock > 0 ? "Add to Cart" : "Sold Out"}
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-amber-600 text-amber-600 hover:bg-amber-100 flex items-center justify-center"
              onClick={handleAddToWishlist}
              disabled={wishlistLoading}
            >
              <Heart className="mr-2" size={18} />
              {wishlistLoading ? "Adding..." : "Add to Wishlist"}
            </Button>
          </div>
          {cartError && (
            <p className="text-red-500 text-sm mt-2">{cartError}</p>
          )}
          {wishlistError && (
            <p className="text-red-500 text-sm mt-2">{wishlistError}</p>
          )}

          <Link to="/shop" className="mt-6 inline-block">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-gray-600 text-gray-600 hover:bg-gray-100 flex items-center justify-center"
            >
              <ArrowLeft className="mr-2" size={18} />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;