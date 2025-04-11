import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeFromWishlist, addToCart } from "@/store/Cart-Slice";
import { Button } from "@/components/ui/button";

const WishlistSection = () => {
  const dispatch = useDispatch();
  const { wishlist, wishlistLoading, wishlistError } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleAddToCart = (productId) => {
    dispatch(addToCart({ productId, quantity: 1 }));
    dispatch(removeFromWishlist(productId)); // Optional: remove after adding to cart
  };

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  if (wishlistLoading) return <div className="p-6 text-center">Loading...</div>;
  if (wishlistError) return <div className="p-6 text-center text-red-500">Error: {wishlistError}</div>;

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Wishlist</h2>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <div key={item.productId._id} className="border p-4 rounded-lg flex flex-col">
              <p className="font-medium text-gray-900">{item.productId.name}</p>
              <p className="text-amber-600 font-bold">MWK {item.productId.price.toFixed(2)}</p>
              {item.productId.stock > 0 ? (
                <p className="text-sm text-green-600">In Stock: {item.productId.stock}</p>
              ) : (
                <p className="text-sm text-red-500">Out of Stock</p>
              )}
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddToCart(item.productId._id)}
                  disabled={item.productId.stock === 0}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(item.productId._id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default WishlistSection;