import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchPublicProducts } from "@/store/Product-slice";

const Shop = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6; // Adjust as needed

  // Sorting and filtering state
  const [sortOption, setSortOption] = useState("default");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    dispatch(fetchPublicProducts());
  }, [dispatch]);

  // Filter and sort products
  const filteredProducts = products
    .filter((product) =>
      filterCategory === "all" ? true : product.category === filterCategory
    )
    .sort((a, b) => {
      if (sortOption === "priceLow") return a.price - b.price;
      if (sortOption === "priceHigh") return b.price - a.price;
      return 0; // Default: no sorting
    });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6 text-center">Loading shop...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-6 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  // Unique categories for filter
  const categories = ["all", ...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen pt-24 px-6 bg-gray-50">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          🛍️ Shop Our Collection
        </h1>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Filter by Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-amber-500 focus:border-amber-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Sort by:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="default">Default</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">
              No products available in this category.
            </p>
          ) : (
            currentProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <Link to={`/product/${product._id}`} className="block">
                  <img
                    src={product.imageUrl || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-t-xl"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-500 text-sm truncate mt-1">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="text-amber-600 font-bold text-lg">
                        MWK{product.price.toFixed(2)}
                      </span>
                      {product.oldPrice && (
                        <span className="text-gray-500 line-through ml-2 text-sm">
                          MWK{product.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={
                            i < (product.rating || 0)
                              ? "text-amber-500"
                              : "text-gray-300"
                          }
                          size={16}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">
                    {product.stock > 0 ? (
                      `In Stock: ${product.stock}`
                    ) : (
                      <span className="text-red-500">Out of Stock</span>
                    )}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <Button
                      className="bg-amber-600 hover:bg-amber-700 w-3/4"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="mr-2" size={18} />
                      {product.stock > 0 ? "Add to Cart" : "Sold Out"}
                    </Button>
                    <Link
                      to={`/product/${product._id}`}
                      className="text-amber-600 hover:underline text-sm"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-900 hover:bg-gray-700 text-white"
            >
              Previous
            </Button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-900 hover:bg-gray-700 text-white"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;