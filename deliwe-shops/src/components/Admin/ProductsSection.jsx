import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "@/store/Product-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit } from "lucide-react";
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
      console.log("Image selected for upload:", {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type,
      });
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.image) {
      console.log("Uploading image to Cloudinary with product:", {
        name: formData.name,
        imageName: formData.image.name,
      });
    }
    if (editId) {
      dispatch(updateProduct({ id: editId, productData: formData }))
        .unwrap()
        .then((updatedProduct) => {
          console.log("Product updated successfully:", updatedProduct); // Log full product
          resetForm();
        })
        .catch((err) => console.error("Update failed:", err));
    } else {
      dispatch(createProduct(formData))
        .unwrap()
        .then((newProduct) => {
          console.log("Product created successfully:", newProduct); // Log full product
          resetForm();
        })
        .catch((err) => console.error("Creation failed:", err));
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
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id))
        .unwrap()
        .then(() => console.log("Product deleted successfully"));
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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Product Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          {editId ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="price">Price (MWK)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="oldPrice">Old Price (MWK, optional)</Label>
              <Input
                id="oldPrice"
                name="oldPrice"
                type="number"
                value={formData.oldPrice}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="image">Product Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
            {editId && formData.image === null && !imagePreview && (
              <p className="text-sm text-gray-500 mt-1">
                No new image selected; current image will be kept.
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 flex-1"
              disabled={loading}
            >
              {editId ? "Update Product" : "Create Product"}
            </Button>
            {editId && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="flex-1"
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Product List</h2>
        {products.length === 0 ? (
          <p className="text-gray-600">No products yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b">
                    <td className="p-3">
                      <img
                        src={product.imageUrl || "https://via.placeholder.com/50"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">
                      MWK{product.price.toFixed(2)}
                      {product.oldPrice && (
                        <span className="line-through text-gray-500 ml-2">
                          MWK{product.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Trash2 size={16} />
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