import skincare from "../../assets/category-1.jpg";
import jewelry from "../../assets/category-2.jpg";
import cosmetics from "../../assets/category-3.jpg";
import lotions from "../../assets/category-4.jpg";

import { Link } from "react-router-dom";

const categories = [
  { id: 1, name: "Skincare", image: skincare, link: "/category/skincare" },
  { id: 2, name: "Jewelry", image: jewelry, link: "/category/jewelry" },
  { id: 3, name: "Body Lotions", image: lotions, link: "/category/body-lotions" },
  { id: 4, name: "Cosmetics", image: cosmetics, link: "/category/cosmetics" },
];

const Categories = () => {
  return (
    <section className="max-w-screen-xl mx-auto px-6 py-16">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900 font-serif">
          Shop by Category
        </h2>
        <p className="text-gray-600 mt-2">
          Explore our wide range of beauty and self-care products.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            to={category.link}
            key={category.id}
            className="block rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 hover:shadow-lg bg-white"
          >
            {/* Category Image */}
            <div className="w-full h-56">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover rounded-t-lg"
              />
            </div>

            {/* Category Name */}
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
