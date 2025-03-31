import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { createProduct, fetchProducts } from "@/store/Product-slice";

const ProductsSection = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imageUrl: "",
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createProduct({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
      })
    );
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      imageUrl: "",
    });
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 lg:p-10 max-w-5xl mx-auto transition-all duration-300">
      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 border-b pb-2">
        Manage Products
      </h2>

      {/* Create Product Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow-inner mb-8"
      >
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700 font-medium">
            Product Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border-gray-300 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder="e.g., Luxury Lipstick"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-700 font-medium">
            Description
          </Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="border-gray-300 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder="e.g., Long-lasting premium lipstick"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="text-gray-700 font-medium">
            Price (MWK)
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            className="border-gray-300 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder="e.g., 999.99"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock" className="text-gray-700 font-medium">
            Stock
          </Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            required
            className="border-gray-300 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder="e.g., 50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="text-gray-700 font-medium">
            Category
          </Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="border-gray-300 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder="e.g., Cosmetics"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="imageUrl" className="text-gray-700 font-medium">
            Image URL (Optional)
          </Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="border-gray-300 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder="e.g., http://example.com/image.jpg"
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            disabled={loading}
          >
            {loading ? "Creating..." : "Add Product"}
          </Button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <p className="text-red-600 bg-red-50 p-3 rounded-md mb-6 font-medium">
          {error}
        </p>
      )}

      {/* Product List (Table) */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
          Product List
        </h3>
        {products.length === 0 ? (
          <p className="text-gray-500 italic">No products yet. Add some above!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-amber-100 text-gray-800">
                  <th className="py-3 px-4 text-left font-semibold">Name</th>
                  <th className="py-3 px-4 text-left font-semibold">Price</th>
                  <th className="py-3 px-4 text-left font-semibold">Stock</th>
                  <th className="py-3 px-4 text-left font-semibold">Category</th>
                  <th className="py-3 px-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-3 px-4 text-gray-900">{product.name}</td>
                    <td className="py-3 px-4 text-gray-700">MWK{product.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-700">{product.stock}</td>
                    <td className="py-3 px-4 text-gray-700">{product.category}</td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline"
                        className="text-amber-600 border-amber-600 hover:bg-amber-50 transition-colors"
                        size="sm"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsSection;