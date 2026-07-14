import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { createProduct } from "../services/productService";
import {uploadProductImages, deleteProductImages,} from "../services/supabaseProductService";

function AdminAddProduct() {

    const [formData, setFormData] = useState({
        productId: "",
        name: "",
        altNames: "",
        description: "",
        category: "",
        brand: "",
        model: "",
        price: "",
        labelledPrice: "",
        stock: "",
        isAvailable: true,
        });

const [images, setImages] = useState([]);
const [errors, setErrors] = useState({});
const [isLoading, setIsLoading] = useState(false);
const navigate = useNavigate();

const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]:
      name === "isAvailable"
        ? value === "true"
        : value,
  }));

  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
};

const handleImageChange = (e) => {
  const files = Array.from(e.target.files || []);

  if (files.length > 5) {
    toast.error("You can upload a maximum of 5 images.");
    return;
  }

  setImages(files);
};

const handleRemoveImage = (index) => {
  setImages((prevImages) => prevImages.filter((_, imageIndex) => imageIndex !== index));
};


// validate form fields

const validateForm = () => {

  const newErrors = {};

  if (!formData.productId.trim()) {
    newErrors.productId = "Product ID is required.";
  }

  if (!formData.name.trim()) {
    newErrors.name = "Product Name is required.";
  }

  if (!formData.description.trim()) {
    newErrors.description = "Description is required.";
  }

  if (!formData.category) {
    newErrors.category = "Please select a category.";
  }

  if (!formData.price || Number(formData.price) <= 0) {
    newErrors.price = "Please enter a valid selling price.";
  }

  if (!formData.labelledPrice || Number(formData.labelledPrice) <= 0) {
    newErrors.labelledPrice = "Please enter a valid labelled price.";
  }

  if (
    Number(formData.labelledPrice) < Number(formData.price)
  ) {
    newErrors.labelledPrice =
      "Labelled Price cannot be less than Selling Price.";
  }

  if (
    formData.stock === "" ||
    Number(formData.stock) < 0
  ) {
    newErrors.stock = "Please enter a valid stock quantity.";
  }

  if (images.length === 0) {
    newErrors.images =
      "Please upload at least one product image.";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};




const handleSubmit = async (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  setIsLoading(true);

  // Store uploaded image URLs for cleanup if product creation fails
  let imageUrls = [];

  try {
    imageUrls = await uploadProductImages(images);

    const productData = {
      ...formData,
      images: imageUrls,
      altNames: formData.altNames
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean),
    };

    await createProduct(productData);

    toast.success("Product created successfully.");
    navigate("/admin/products");

  } catch (error) {

    // Delete uploaded images if product creation failed
    if (imageUrls.length > 0) {
      try {
        await deleteProductImages(imageUrls);
      } catch (deleteError) {
        console.error("Image Cleanup Error:", deleteError);
      }
    }

    console.error(error);

    toast.error(
      error.response?.data?.message || "Failed to create product."
    );

  } finally {
    setIsLoading(false);
  }
};



const imagePreviewUrls = useMemo(() => {
  return images.map((image) => URL.createObjectURL(image));
}, [images]);

useEffect(() => {
  return () => {
    imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
  };
}, [imagePreviewUrls]);

  return (

    

    <AdminLayout title="Add Product">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8">

        {/* ================= Page Header ================= */}
        <h2 className="text-3xl font-bold text-secondary">
          Add New Product
        </h2>

        <p className="mt-2 text-gray-600">
          Fill in the product information below to create a new product.
        </p>

        {/* ================= Basic Information ================= */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-secondary mb-6">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Product ID */}
            <div>
              <label className="block mb-2 font-medium text-secondary">
                Product ID <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                placeholder="Enter product ID"
                className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent border ${
                  errors.productId ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors.productId && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.productId}
                </p>
              )}
            </div>

            {/* Product Name */}
            <div>
              <label className="block mb-2 font-medium text-secondary">
                Product Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors.name && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

          </div>

          {/* Alternative Names */}
          <div className="mt-6">
            <label className="block mb-2 font-medium text-secondary">
              Alternative Names
            </label>

            <input
              type="text"
              name="altNames"
              value={formData.altNames}
              onChange={handleChange}
              placeholder="Example: Gaming Laptop, Notebook"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
            />

            <p className="text-sm text-gray-500 mt-2">
              Separate multiple names using commas.
            </p>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block mb-2 font-medium text-secondary">
              Description <span className="text-red-500">*</span>
            </label>

            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description..."
              className={`w-full rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-accent border ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            ></textarea>

            {errors.description && (
              <p className="mt-2 text-sm text-red-500">
                {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* ================= Product Details ================= */}
        <div className="mt-10 border-t border-gray-200 pt-10">

          <h3 className="text-2xl font-bold text-secondary mb-6">
            Product Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Category */}
            <div>
              <label className="block mb-2 font-medium text-secondary">
                Category <span className="text-red-500">*</span>
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent border ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Category</option>
                <option value="Laptop">Laptop</option>
                <option value="Desktop">Desktop</option>
                <option value="Monitor">Monitor</option>
                <option value="Keyboard">Keyboard</option>
                <option value="Mouse">Mouse</option>
                <option value="Printer">Printer</option>
                <option value="Storage">Storage</option>
                <option value="Networking">Networking</option>
                <option value="Accessories">Accessories</option>
                <option value="Other">Other</option>
              </select>

              {errors.category && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block mb-2 font-medium text-secondary">
                Brand
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Example: ASUS"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block mb-2 font-medium text-secondary">
                Model
              </label>

              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Example: TUF A15"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

          </div>

        </div>

                {/* ================= Pricing ================= */}
        <div className="mt-10 border-t border-gray-200 pt-10">

        <h3 className="text-2xl font-bold text-secondary mb-6">
            Pricing
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Price */}
            <div>
            <label className="block mb-2 font-medium text-secondary">
                Selling Price <span className="text-red-500">*</span>
            </label>

            <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter selling price"
                className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent border ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
            />

            {errors.price && (
              <p className="mt-2 text-sm text-red-500">
                {errors.price}
              </p>
            )}
            </div>

            {/* Labelled Price */}
            <div>
            <label className="block mb-2 font-medium text-secondary">
                Labelled Price <span className="text-red-500">*</span>
            </label>

            <input
                type="number"
                name="labelledPrice"
                value={formData.labelledPrice}
                onChange={handleChange}
                placeholder="Enter labelled price"
                className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent border ${
                  errors.labelledPrice ? "border-red-500" : "border-gray-300"
                }`}
            />

            {errors.labelledPrice && (
              <p className="mt-2 text-sm text-red-500">
                {errors.labelledPrice}
              </p>
            )}
            </div>

        </div>

        </div>

            {/* ================= Inventory ================= */}
            <div className="mt-10 border-t border-gray-200 pt-10">

            <h3 className="text-2xl font-bold text-secondary mb-6">
                Inventory
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Stock */}
                <div>
                <label className="block mb-2 font-medium text-secondary">
                    Stock Quantity <span className="text-red-500">*</span>
                </label>

                <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                    className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent border ${
                      errors.stock ? "border-red-500" : "border-gray-300"
                    }`}
                />

                {errors.stock && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.stock}
                  </p>
                )}
                </div>

                {/* Status */}
                <div>
                <label className="block mb-2 font-medium text-secondary">
                    Product Status
                </label>

                <select
                    name="isAvailable"
                    value={formData.isAvailable ? "true" : "false"}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                    <option value="true">
                    Available
                    </option>

                    <option value="false">
                    Unavailable
                    </option>

                </select>
                </div>

            </div>

            </div>

            {/* ================= Product Images ================= */}
            <div className="mt-10 border-t border-gray-200 pt-10">

            <h3 className="text-2xl font-bold text-secondary mb-6">
                Product Images
            </h3>

            <label className="block mb-2 font-medium text-secondary">
                Upload Images <span className="text-red-500">*</span>
            </label>

            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className={`block w-full rounded-xl px-4 py-3 file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-lg file:bg-accent file:text-white hover:file:bg-teal-700 border ${
                  errors.images ? "border-red-500" : "border-gray-300"
                }`}
            />

            {errors.images && (
              <p className="mt-2 text-sm text-red-500">
                {errors.images}
              </p>
            )}

            <p className="text-sm text-gray-500 mt-3">
                You can upload multiple product images.
            </p>

            <p className="text-sm text-gray-500 mt-2">
                Selected Images: {images.length} / 5
            </p>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={`${image.name}-${index}`} className="relative overflow-hidden rounded-xl border border-gray-300">
                    <img
                      src={imagePreviewUrls[index]}
                      alt={image.name}
                      className="h-40 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-sm hover:bg-white"
                      aria-label={`Remove ${image.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            </div>

            {/* ================= Buttons ================= */}
            <div className="mt-12 flex justify-end gap-4">

            <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="px-8 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
            >
                Cancel
            </button>

            <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-teal-700 transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? "Saving..." : "Save Product"}
            </button>

            </div>

      </form>
    </AdminLayout>
  );
}

export default AdminAddProduct;