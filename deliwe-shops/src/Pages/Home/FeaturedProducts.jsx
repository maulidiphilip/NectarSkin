import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import jewelry1 from "../../assets/card-1.png";
import serum from "../../assets/card-2.png";
import lipstick from "../../assets/card-3.png";
import lotion from "../../assets/card-5.jpg";

const products = [
  {
    id: 1,
    name: "Luxury Gold Necklace",
    price: 129.99,
    image: jewelry1,
  },
  {
    id: 2,
    name: "Hydrating Face Serum",
    price: 59.99,
    image: serum,
  },
  {
    id: 3,
    name: "Velvet Matte Lipstick",
    price: 19.99,
    image: lipstick,
  },
  {
    id: 4,
    name: "Shea Butter Body Lotion",
    price: 24.99,
    image: lotion,
  },
];
const FeaturedProducts = () => {
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
        {products.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="text-amber-600 font-bold text-xl mt-2">
            MWK{product.price}
              </p>
              <Button className="mt-4 w-full bg-amber-600 hover:bg-amber-700">
                Buy Now
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default FeaturedProducts