import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { createProduct } from "../services/productService";
import { uploadProductImages, deleteProductImages } from "../services/supabaseProductService";

// Shared input classes so every field in the form looks and behaves
// identically — border-only, no focus ring, error state swaps to rose.
const fieldClass = (hasError) =>
  `w-full rounded-md border px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-accent ${
    hasError ? "border-rose-400" : "border-slate-200"
  }`;

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-slate-700">
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-rose-600">{message}</p>;
}

function SectionTitle({ children }) {
  return <h3 className="mb-5 text-lg font-bold text-slate-900">{children}</h3>;
}

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

  const productIdRef = useRef(null);
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const categoryRef = useRef(null);
  const priceRef = useRef(null);
  const labelledPriceRef = useRef(null);
  const stockRef = useRef(null);
  const imagesRef = useRef(null);
    


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "isAvailable" ? value === "true" : value,
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

    if (Number(formData.labelledPrice) < Number(formData.price)) {
      newErrors.labelledPrice = "Labelled Price cannot be less than Selling Price.";
    }

    if (formData.stock === "" || Number(formData.stock) < 0) {
      newErrors.stock = "Please enter a valid stock quantity.";
    }

    if (images.length === 0) {
      newErrors.images = "Please upload at least one product image.";
    }

    setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        const refMap = {
          productId: productIdRef,
          name: nameRef,
          description: descriptionRef,
          category: categoryRef,
          price: priceRef,
          labelledPrice: labelledPriceRef,
          stock: stockRef,
          images: imagesRef,
        };

        const firstError = Object.keys(newErrors)[0];
        const field = refMap[firstError]?.current;

        if (field) {
          field.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          field.focus();
        }

        return false;
      }

      return true;
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

      toast.error(error.response?.data?.message || "Failed to create product.");
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
      <form onSubmit={handleSubmit} className="rounded border border-slate-200 bg-white p-6 sm:p-8">
        {/* ================= Page Header ================= */}
        {/* <h2 className="text-2xl font-bold text-slate-900">Add New Product</h2> */}

        <p className="mt-1 text-sm text-black">
          <b><i>● Fill in the product information below to create a new product.</i></b>
        </p>

        {/* ================= Basic Information ================= */}
        <div className="mt-8">
          <SectionTitle>Basic Information</SectionTitle>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Product ID */}
            <div>
              <FieldLabel required>Product ID</FieldLabel>

              <input
                ref={productIdRef}
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                placeholder="Enter product ID"
                className={fieldClass(errors.productId)}
              />

              <FieldError message={errors.productId} />
            </div>

            {/* Product Name */}
            <div>
              <FieldLabel required>Product Name</FieldLabel>

              <input
                ref={nameRef}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className={fieldClass(errors.name)}
              />

              <FieldError message={errors.name} />
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
              className={fieldClass(false)}
            />

            <p className="mt-1.5 text-sm text-slate-500">
              Separate multiple names using commas.
            </p>
          </div>

          {/* Description */}
          <div className="mt-6">
            <FieldLabel required>Description</FieldLabel>

            <textarea
              ref={descriptionRef}
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description..."
              className={`${fieldClass(errors.description)} resize-none`}
            ></textarea>

            <FieldError message={errors.description} />
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
                ref={categoryRef}
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`cursor-pointer ${fieldClass(errors.category)}`}
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

              <FieldError message={errors.category} />
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
                className={fieldClass(false)}
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
                className={fieldClass(false)}
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
                ref={priceRef}
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter selling price"
                className={fieldClass(errors.price)}
              />

              <FieldError message={errors.price} />
            </div>

            {/* Labelled Price */}
            <div>
              <FieldLabel required>Labelled Price</FieldLabel>

              <input
                ref={labelledPriceRef}              
                type="number"
                name="labelledPrice"
                value={formData.labelledPrice}
                onChange={handleChange}
                placeholder="Enter labelled price"
                className={fieldClass(errors.labelledPrice)}
              />

              <FieldError message={errors.labelledPrice} />
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
                ref={stockRef}
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                className={fieldClass(errors.stock)}
              />

              <FieldError message={errors.stock} />
            </div>

            {/* Status */}
            <div>
              <FieldLabel>Product Status</FieldLabel>

              <select
                name="isAvailable"
                value={formData.isAvailable ? "true" : "false"}
                onChange={handleChange}
                className={`cursor-pointer ${fieldClass(false)}`}
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
            ref={imagesRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className={`block w-full cursor-pointer rounded-md border px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent file:px-4 file:py-2 file:text-white file:transition-colors hover:file:bg-secondary ${
              errors.images ? "border-rose-400" : "border-slate-200"
            }`}
          />

          <FieldError message={errors.images} />

          <p className="mt-2 text-sm text-slate-500">
            You can upload multiple product images.
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Selected Images: {images.length} / 5
          </p>

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => (
                <div
                  key={`${image.name}-${index}`}
                  className="relative overflow-hidden rounded-md border border-slate-200 bg-white"
                >
                  <img
                    src={imagePreviewUrls[index]}
                    alt={image.name}
                    className="h-40 w-full object-contain p-2"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
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
            disabled={isLoading}
            className="cursor-pointer rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default AdminAddProduct;