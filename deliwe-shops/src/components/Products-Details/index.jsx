import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import product1 from "../../assets/card-1.png";
import product2 from "../../assets/card-2.png";
import product3 from "../../assets/card-3.png";

const products = [
  { id: 1, name: "Luxury Gold Necklace", desc: "Elegant and timeless piece.", price: 129.99, oldPrice: 159.99, details: "Crafted from premium gold...", image: product1 },
  { id: 2, name: "Hydrating Face Serum", desc: "Nourish your skin deeply.", price: 49.99, oldPrice: 69.99, details: "Infused with Vitamin C...", image: product2 },
  { id: 3, name: "Velvet Matte Lipstick", desc: "Long-lasting smooth texture.", price: 14.99, oldPrice: 24.99, details: "A rich and creamy formula...", image: product3 },
];

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) return <p className="text-center text-gray-600 mt-20">Product not found.</p>;

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row gap-12">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <img src={product.image} alt={product.name} className="w-full h-auto rounded-lg shadow-lg" />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600 mt-3">{product.details}</p>

          {/* Price */}
          <div className="flex items-center mt-4">
            <span className="text-amber-600 font-bold text-2xl">MWK{product.price}</span>
            {product.oldPrice && <span className="text-gray-500 line-through ml-2 text-lg">MWK{product.oldPrice}</span>}
          </div>

          {/* Quantity Selector */}
          <div className="mt-6 flex items-center">
            <span className="mr-3 text-gray-700">Quantity:</span>
            <input type="number" min="1" defaultValue="1" className="border px-3 py-1 w-16 text-center rounded-lg" />
          </div>

          {/* Add to Cart Button */}
          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white mt-6">
            <ShoppingCart className="mr-2" size={18} /> Add to Cart
          </Button>

          {/* Back to Shop */}
          <Link to="/shop" className="text-amber-600 hover:underline mt-4 inline-block flex items-center">
            <Button>
            <ArrowLeft className="mr-2" size={18} /> Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
