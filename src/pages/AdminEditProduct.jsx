import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { getProductById, updateProduct } from "../services/productService";
import { uploadProductImages } from "../services/supabaseProductService";

function AdminEditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
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
    isAvailable: "true",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [previewImageUrls, setPreviewImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [productNotFound, setProductNotFound] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setIsLoading(false);
        setProductNotFound(true);
        return;
      }

      try {
        setIsLoading(true);
        setProductNotFound(false);

        const response = await getProductById(productId);
        const product = response?.product || response?.data?.product || response;

        if (!product) {
          setProductNotFound(true);
          return;
        }

        setFormData({
          productId: product.productId || "",
          name: product.name || "",
          altNames: Array.isArray(product.altNames)
            ? product.altNames.join(", ")
            : product.altNames || "",
          description: product.description || "",
          category: product.category || "",
          brand: product.brand || "",
          model: product.model || "",
          price: product.price ?? "",
          labelledPrice: product.labelledPrice ?? "",
          stock: product.stock ?? "",
          isAvailable: product.isAvailable ? "true" : "false",
        });

        setExistingImages(Array.isArray(product.images) ? product.images : []);
      } catch (error) {
        console.error("Fetch Product Error:", error);
        setProductNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return false;
    if (!formData.description.trim()) return false;
    if (!formData.category) return false;
    if (!formData.price || Number(formData.price) <= 0) return false;
    if (!formData.labelledPrice || Number(formData.labelledPrice) <= 0) return false;
    if (formData.stock === "" || Number(formData.stock) < 0) return false;

    return true;
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    if (existingImages.length + newImageFiles.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      event.target.value = "";
      return;
    }

    const imagePreviewUrls = files.map((file) => URL.createObjectURL(file));

    setNewImageFiles((prevImages) => [...prevImages, ...files]);
    setPreviewImageUrls((prevUrls) => [...prevUrls, ...imagePreviewUrls]);
    event.target.value = "";
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prevImages) =>
      prevImages.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const handleRemoveNewImage = (index) => {
    setPreviewImageUrls((prevUrls) =>
      prevUrls.filter((_, imageIndex) => imageIndex !== index)
    );

    setNewImageFiles((prevFiles) =>
      prevFiles.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsUpdating(true);

      let uploadedImageUrls = [];

      if (newImageFiles.length > 0) {
        uploadedImageUrls = await uploadProductImages(newImageFiles);
        setExistingImages(uploadedImageUrls);
        setPreviewImageUrls([]);
        setNewImageFiles([]);
      }

      const {
        productId: _,
        ...payload
        } = formData;

        payload.altNames = payload.altNames
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean);

        payload.price = Number(payload.price);
        payload.labelledPrice = Number(payload.labelledPrice);
        payload.stock = Number(payload.stock);
        payload.isAvailable = payload.isAvailable === "true";
        payload.images = [...existingImages, ...uploadedImageUrls];

      await updateProduct(productId, payload);

      toast.success("Product updated successfully.");
      navigate("/admin/products");
    } catch (error) {
      console.error("Update Product Error:", error);
      toast.error(error.response?.data?.message || "Failed to update product.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout title="Edit Product">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8">
        {isLoading && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            Loading product...
          </div>
        )}

        {productNotFound && !isLoading && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            Product not found.
          </div>
        )}

        {!productNotFound && !isLoading && (
          <>
            {/* ================= Page Header ================= */}
            <h2 className="text-3xl font-bold text-secondary">
              Edit Product
            </h2>

            <p className="mt-2 text-gray-600">
              Update existing product information.
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
                    disabled
                    placeholder="Enter product ID"
                    className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent border border-gray-300 bg-gray-100 text-gray-600"
                  />
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
                    className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent border border-gray-300"
                  />
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
                  className="w-full rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-accent border border-gray-300"
                ></textarea>
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
                    className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent border border-gray-300"
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
                    className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent border border-gray-300"
                  />
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
                    className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent border border-gray-300"
                  />
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
                    className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent border border-gray-300"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block mb-2 font-medium text-secondary">
                    Product Status
                  </label>

                  <select
                    name="isAvailable"
                    value={formData.isAvailable}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
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
                className="block w-full rounded-xl px-4 py-3 file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-lg file:bg-accent file:text-white hover:file:bg-teal-700 border border-gray-300"
              />

              <p className="text-sm text-gray-500 mt-3">
                You can upload multiple product images.
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Selected Images: {existingImages.length + previewImageUrls.length} / 5
              </p>

              {(existingImages.length > 0 || previewImageUrls.length > 0) && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {existingImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative overflow-hidden rounded-xl border border-gray-300"
                    >
                      <img
                        src={image}
                        alt={`Existing product ${index + 1}`}
                        className="h-40 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition duration-200 hover:bg-red-700"
                        aria-label={`Remove existing image ${index + 1}`}
                      >
                        <span className="text-lg leading-none">×</span>
                      </button>
                    </div>
                  ))}

                  {previewImageUrls.map((image, index) => (
                    <div
                      key={`preview-${index}`}
                      className="relative overflow-hidden rounded-xl border border-gray-300"
                    >
                      <img
                        src={image}
                        alt={`New preview ${index + 1}`}
                        className="h-40 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition duration-200 hover:bg-red-700"
                        aria-label={`Remove new image ${index + 1}`}
                      >
                        <span className="text-lg leading-none">×</span>
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
                disabled={isUpdating}
                className="px-8 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-teal-700 transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Updating..." : "Update Product"}
              </button>
            </div>
          </>
        )}
      </form>
    </AdminLayout>
  );
}

export default AdminEditProduct;
