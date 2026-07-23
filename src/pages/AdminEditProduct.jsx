import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { getProductById, updateProduct } from "../services/productService";
import { uploadProductImages } from "../services/supabaseProductService";

// Shared input classes — same as AdminAddProduct, so both forms look and
// behave identically.
const fieldClass = (disabled = false) =>
  `w-full rounded-md border px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent ${
    disabled
      ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500"
      : "border-slate-200 text-slate-900"
  }`;

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-slate-700">
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
  );
}

function SectionTitle({ children }) {
  return <h3 className="mb-5 text-lg font-bold text-slate-900">{children}</h3>;
}

function ImageTile({ src, alt, onRemove }) {
  return (
    <div className="relative overflow-hidden rounded-md border border-slate-200 bg-white">
      <img src={src} alt={alt} className="h-40 w-full object-contain p-2" />

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
        aria-label={`Remove ${alt}`}
      >
        ×
      </button>
    </div>
  );
}

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

      const { productId: _, ...payload } = formData;

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
      <form onSubmit={handleSubmit} className="rounded border border-slate-200 bg-white p-6 sm:p-8">
        {isLoading && (
          <div className="rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Loading product...
          </div>
        )}

        {productNotFound && !isLoading && (
          <div className="rounded border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            Product not found.
          </div>
        )}

        {!productNotFound && !isLoading && (
          <>
            {/* ================= Page Header ================= */}
            {/* <h2 className="text-2xl font-bold text-slate-900">Edit Product</h2> */}



            <p className="mt-1 text-sm text-black">
              <b><i>● Update existing product informations.</i></b>
              
            </p>

            

            {/* ================= Basic Information ================= */}
            <div className="mt-8">
              <SectionTitle>Basic Informations</SectionTitle>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Product ID */}
                <div>
                  <FieldLabel required>Product ID</FieldLabel>

                  <input
                    type="text"
                    name="productId"
                    value={formData.productId}
                    disabled
                    placeholder="Enter product ID"
                    className={fieldClass(true)}
                  />
                </div>

                {/* Product Name */}
                <div>
                  <FieldLabel required>Product Name</FieldLabel>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className={fieldClass()}
                  />
                </div>
              </div>

              {/* Alternative Names */}
              <div className="mt-6">
                <FieldLabel>Alternative Names</FieldLabel>

                <input
                  type="text"
                  name="altNames"
                  value={formData.altNames}
                  onChange={handleChange}
                  placeholder="Example: Gaming Laptop, Notebook"
                  className={fieldClass()}
                />

                <p className="mt-1.5 text-sm text-slate-500">
                  Separate multiple names using commas.
                </p>
              </div>

              {/* Description */}
              <div className="mt-6">
                <FieldLabel required>Description</FieldLabel>

                <textarea
                  rows="5"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description..."
                  className={`${fieldClass()} resize-none`}
                ></textarea>
              </div>
            </div>

            {/* ================= Product Details ================= */}
            <div className="mt-8 border-t border-slate-100 pt-8">
              <SectionTitle>Product Details</SectionTitle>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Category */}
                <div>
                  <FieldLabel required>Category</FieldLabel>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`cursor-pointer ${fieldClass()}`}
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
                  <FieldLabel>Brand</FieldLabel>

                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Example: ASUS"
                    className={fieldClass()}
                  />
                </div>

                {/* Model */}
                <div>
                  <FieldLabel>Model</FieldLabel>

                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Example: TUF A15"
                    className={fieldClass()}
                  />
                </div>
              </div>
            </div>

            {/* ================= Pricing ================= */}
            <div className="mt-8 border-t border-slate-100 pt-8">
              <SectionTitle>Pricing</SectionTitle>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Price */}
                <div>
                  <FieldLabel required>Selling Price</FieldLabel>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter selling price"
                    className={fieldClass()}
                  />
                </div>

                {/* Labelled Price */}
                <div>
                  <FieldLabel required>Labelled Price</FieldLabel>

                  <input
                    type="number"
                    name="labelledPrice"
                    value={formData.labelledPrice}
                    onChange={handleChange}
                    placeholder="Enter labelled price"
                    className={fieldClass()}
                  />
                </div>
              </div>
            </div>

            {/* ================= Inventory ================= */}
            <div className="mt-8 border-t border-slate-100 pt-8">
              <SectionTitle>Inventory</SectionTitle>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Stock */}
                <div>
                  <FieldLabel required>Stock Quantity</FieldLabel>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                    className={fieldClass()}
                  />
                </div>

                {/* Status */}
                <div>
                  <FieldLabel>Product Status</FieldLabel>

                  <select
                    name="isAvailable"
                    value={formData.isAvailable}
                    onChange={handleChange}
                    className={`cursor-pointer ${fieldClass()}`}
                  >
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ================= Product Images ================= */}
            <div className="mt-8 border-t border-slate-100 pt-8">
              <SectionTitle>Product Images</SectionTitle>

              <FieldLabel required>Upload Images</FieldLabel>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full cursor-pointer rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent file:px-4 file:py-2 file:text-white file:transition-colors hover:file:bg-secondary"
              />

              <p className="mt-2 text-sm text-slate-500">
                You can upload multiple product images.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Selected Images: {existingImages.length + previewImageUrls.length} / 5
              </p>

              {(existingImages.length > 0 || previewImageUrls.length > 0) && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {existingImages.map((image, index) => (
                    <ImageTile
                      key={`${image}-${index}`}
                      src={image}
                      alt={`Existing product ${index + 1}`}
                      onRemove={() => handleRemoveExistingImage(index)}
                    />
                  ))}

                  {previewImageUrls.map((image, index) => (
                    <ImageTile
                      key={`preview-${index}`}
                      src={image}
                      alt={`New preview ${index + 1}`}
                      onRemove={() => handleRemoveNewImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ================= Buttons ================= */}
            <div className="mt-10 flex justify-end gap-3 border-t border-slate-100 pt-8">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="cursor-pointer rounded-md border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-accent hover:text-accent"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isUpdating}
                className="cursor-pointer rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
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