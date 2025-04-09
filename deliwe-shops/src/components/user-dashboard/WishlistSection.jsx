import React from "react";
import { Button } from "@/components/ui/button";

const WishlistSection = () => {
  // Mock data (replace with Redux/API data later)
  const wishlist = [
    { id: "P001", name: "Wireless Headphones", price: 49.99 },
    { id: "P002", name: "Smart Watch", price: 99.99 },
  ];

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Wishlist</h2>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishlist.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg">
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm">
                  Add to Cart
                </Button>
                <Button variant="destructive" size="sm">
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default WishlistSection;