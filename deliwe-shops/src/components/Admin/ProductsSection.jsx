import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "@/store/Product-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Trash2, Edit, Plus } from "lucide-react";
import { Label } from "@radix-ui/react-label";

const ProductsSection = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    oldPrice: "",
    image: null,
  });
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      dispatch(updateProduct({ id: editId, productData: formData }))
        .unwrap()
        .then(() => {
          resetForm();
          setIsSheetOpen(false);
        });
    } else {
      dispatch(createProduct(formData))
        .unwrap()
        .then(() => {
          resetForm();
          setIsSheetOpen(false);
        });
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      oldPrice: product.oldPrice || "",
      image: null,
    });
    setImagePreview(product.imageUrl || null);
    setIsSheetOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id)).unwrap();
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      oldPrice: "",
      image: null,
    });
    setImagePreview(null);
  };

  const openSheetForNewProduct = () => {
    resetForm();
    setIsSheetOpen(true);
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Error: {error}</div>;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button
          onClick={openSheetForNewProduct}
          className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
        >
          <Plus size={16} className="mr-2" /> Add Product
        </Button>
      </div>

      {/* Products Display */}
      {products.length === 0 ? (
        <p className="text-gray-600 text-center py-10">No products yet. Add one to get started!</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          {/* Table for Larger Screens */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-amber-100 text-gray-700">
                <tr>
                  <th className="p-3 sm:p-4 font-semibold">Image</th>
                  <th className="p-3 sm:p-4 font-semibold">Name</th>
                  <th className="p-3 sm:p-4 font-semibold">Price</th>
                  <th className="p-3 sm:p-4 font-semibold">Stock</th>
                  <th className="p-3 sm:p-4 font-semibold">Category</th>
                  <th className="p-3 sm:p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 sm:p-4">
                      <img
                        src={product.imageUrl || "https://via.placeholder.com/50"}
                        alt={product.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                      />
                    </td>
                    <td className="p-3 sm:p-4 text-gray-900">{product.name}</td>
                    <td className="p-3 sm:p-4 text-amber-600">
                      MWK{product.price.toFixed(2)}
                      {product.oldPrice && (
                        <span className="text-gray-500 line-through ml-2">
                          MWK{product.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="p-3 sm:p-4">
                      {product.stock > 0 ? product.stock : <span className="text-red-500">Out of Stock</span>}
                    </td>
                    <td className="p-3 sm:p-4 text-gray-600">{product.category}</td>
                    <td className="p-3 sm:p-4 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(product._id)}>
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card Layout for Mobile */}
          <div className="block sm:hidden space-y-4 p-4">
            {paginatedProducts.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-4">
                  <img
                    src={product.imageUrl || "https://via.placeholder.com/50"}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-semibold">{product.name}</h3>
                    <p className="text-amber-600">
                      MWK{product.price.toFixed(2)}
                      {product.oldPrice && (
                        <span className="text-gray-500 line-through ml-2">
                          MWK{product.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </p>
                    <p className="text-gray-600">Stock: {product.stock > 0 ? product.stock : "Out of Stock"}</p>
                    <p className="text-gray-600">Category: {product.category}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(product._id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Previous
              </Button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Responsive Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-[90vw] sm:w-[400px] max-w-full p-4 sm:p-6 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-lg sm:text-xl font-bold">
              {editId ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-medium">Price (MWK)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="oldPrice" className="text-sm font-medium">Old Price (optional)</Label>
                  <Input
                    id="oldPrice"
                    name="oldPrice"
                    type="number"
                    value={formData.oldPrice}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock" className="text-sm font-medium">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="image" className="text-sm font-medium">Product Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            <SheetFooter className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
                disabled={loading}
              >
                {editId ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSheetOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProductsSection;