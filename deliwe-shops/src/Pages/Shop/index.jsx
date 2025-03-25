import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import product1 from "../../assets/card-1.png";
import product2 from "../../assets/card-2.png";
import product3 from "../../assets/card-3.png";

const products = [
    { id: 1, name: "Luxury Gold Necklace", desc: "Elegant and timeless piece.", price: 129.99, oldPrice: 159.99, rating: 5, image: product1 },
    { id: 2, name: "Hydrating Face Serum", desc: "Nourish your skin deeply.", price: 49.99, oldPrice: 69.99, rating: 4, image: product2 },
    { id: 3, name: "Velvet Matte Lipstick", desc: "Long-lasting smooth texture.", price: 14.99, oldPrice: 24.99, rating: 4, image: product3 },
];

const Shop = () => {
    return (
        <div className="min-h-screen pt-24 px-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">🛍️ Shop Our Collection</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-screen-xl mx-auto">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden p-4 hover:shadow-lg transition">
                        {/* Make Entire Product Clickable */}
                        <Link to={`/product/${product.id}`} className="block">
                            <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
                            <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
                            <p className="text-gray-500 text-sm truncate">{product.desc}</p>
                        </Link>

                        {/* Price & Rating */}
                        <div className="flex items-center justify-between mt-3">
                            <div>
                                <span className="text-amber-600 font-bold text-lg">MWK{product.price}</span>
                                {product.oldPrice && <span className="text-gray-500 line-through ml-2">MWK{product.oldPrice}</span>}
                            </div>
                            <div className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <Star key={i} className={i < product.rating ? "text-amber-500" : "text-gray-300"} size={16} />
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-4 flex justify-between">
                            <Button className="bg-amber-600 hover:bg-amber-700 w-full">
                                <ShoppingCart className="mr-2" size={18} /> Add to Cart
                            </Button>
                            <Link to={`/product/${product.id}`} className="text-amber-600 hover:underline ml-4">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shop;
