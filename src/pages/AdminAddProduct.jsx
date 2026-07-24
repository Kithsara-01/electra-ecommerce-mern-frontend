import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaImages,
  FaXmark,
} from "react-icons/fa6";

import { HiSparkles } from "react-icons/hi2";
import { ImSpinner2 } from "react-icons/im";


import AdminLayout from "../components/AdminLayout";
import {
  createProduct,
  generateAIDescription,
  generateAIAlternativeNames,
} from "../services/productService";

import { uploadProductImages, deleteProductImages } from "../services/supabaseProductService";

// Shared input classes so every field in the form looks and behaves
// identically — border-only, no focus ring, error state swaps to rose.
const fieldClass = (hasError) =>
  `w-full rounded-md border px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-accent ${hasError ? "border-rose-400" : "border-slate-200"
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

// ================= AI Experience — shared components =================
// Used identically by both AI features (Alternative Names + Description)
// so the two stay visually consistent. Flat, bordered, no gradients or
// motion — small badges are the one place rounded-full is allowed.

function AIBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 px-3 py-1 text-xs font-semibold text-accent">
      <HiSparkles
        size={15}
        className="text-yellow-400"
      />
      AI Powered
      <span className="text-accent/40">·</span>
      <span className="font-normal text-accent/70">Google Gemini</span>
    </span>
  );
}

function AIActionButton({ onClick, loading, disabled, loadingDots }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="
        group
        relative
        overflow-hidden
        inline-flex
        items-center
        gap-2
        rounded-lg
        border
        border-accent
        bg-white
        px-4
        py-2
        text-[15px]
        font-semibold
        text-accent
        transition-all
        duration-300
        hover:border-yellow-400
        hover:bg-yellow-50/30
        disabled:cursor-not-allowed
        disabled:opacity-70
        disabled:bg-slate-100
        disabled:border-slate-300
      "
    >
      {/* Shimmer */}
      <span
        className="
    pointer-events-none
    absolute
    top-0
    -left-12
    h-full
    w-8
    -skew-x-12
    bg-white/60
    blur-sm
    transition-all
    duration-700
    group-hover:left-[120%]
  "
      />

      <HiSparkles
        size={16}
        className="
    relative
    z-10
    text-yellow-400
    transition-transform
    duration-300
    group-hover:rotate-12
    group-hover:scale-110
  "
      />
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <ImSpinner2 size={14} className="animate-spin" />
            Generating
            <span className="inline-block w-4">{loadingDots}</span>
          </>
        ) : (
          "AI Suggest"
        )}
      </span>
    </button>
  );
}


function AIHelperNote({ children }) {
  return (
    <p className="mt-2 flex items-start gap-1.5 rounded-md  px-3 py-2 text-xs text-slate-600">
      <span className="mt-0.5">💡</span>
      <span>{children}</span>
    </p>
  );
}

function AIGeneratedTag({ show }) {
  if (!show) return null;

  return (
    <span className="pointer-events-none absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-white">
      <HiSparkles
        size={12}
        className="text-yellow-300"
      />
      AI Generated
    </span>
  );
}

// Every form section shares one consistent header: an icon-tinted square +
// step label + title + short subtitle — gives the long form a clear
// step-by-step structure without cards fighting each other for attention.
function SectionCard({ title, subtitle, children }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-6 sm:p-7">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
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

  // Each AI action gets its own independent loading state so that
  // triggering one AI button never disables/affects the other.
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingAltNames, setIsGeneratingAltNames] = useState(false);

  // Transient "just generated" flags — drive a brief highlighted border on
  // the field for a few seconds after an AI action completes. UI-only,
  // no business logic, no shadow/glow — just a border color change.
  const [justGeneratedDescription, setJustGeneratedDescription] = useState(false);
  const [justGeneratedAltNames, setJustGeneratedAltNames] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");

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

  const generateProductName = () => {
    const brand = formData.brand.trim();
    const model = formData.model.trim();

    if (!brand && !model) return;

    setFormData((prev) => ({
      ...prev,
      name: `${brand} ${model}`.trim(),
    }));

    setErrors((prev) => ({
      ...prev,
      name: "",
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

  const handleGenerateDescription = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter the product name first.");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category first.");
      return;
    }

    try {
      setIsGeneratingDescription(true);

      const response = await generateAIDescription({
        productName: formData.name,
        category: formData.category,
      });

      setFormData((prev) => ({
        ...prev,
        description: response.description,
      }));

      toast.success("AI description generated successfully.");

      setJustGeneratedDescription(true);
      setTimeout(() => setJustGeneratedDescription(false), 2600);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to generate AI description.");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleGenerateAlternativeNames = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter the product name first.");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category first.");
      return;
    }

    try {
      setIsGeneratingAltNames(true);

      const response = await generateAIAlternativeNames({
        productName: formData.name,
        category: formData.category,
      });

      setFormData((prev) => ({
        ...prev,
        altNames: response.alternativeNames,
      }));

      toast.success("AI alternative names generated successfully.");

      setJustGeneratedAltNames(true);
      setTimeout(() => setJustGeneratedAltNames(false), 2600);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to generate alternative names.");
    } finally {
      setIsGeneratingAltNames(false);
    }
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

    const alternativeNames = formData.altNames
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);

    if (alternativeNames.length > 5) {
      newErrors.altNames = "You can enter a maximum of 5 alternative names.";
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
    if (!isGeneratingDescription && !isGeneratingAltNames) {
      setLoadingDots("");
      return;
    }

    const interval = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isGeneratingDescription, isGeneratingAltNames]);

  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

  return (
    <AdminLayout title="Add Product">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <p className="text-sm text-black">
            <b><i>● Fill in the product information below to create a new product.</i></b>
          </p>

          {/* ================= Basic Information ================= */}
          <SectionCard
            title="01. Basic Information"
            subtitle="Core identity fields customers and the catalog will use."
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Product ID */}
              <div>
                <FieldLabel required>● Product ID</FieldLabel>

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
                <FieldLabel required>● Product Name</FieldLabel>

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
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <FieldLabel>● Alternative Names</FieldLabel>
                <AIBadge />
              </div>

              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Maximum 5 Names
                </span>

                <div className="flex justify-end">
                  <AIActionButton
                    onClick={handleGenerateAlternativeNames}
                    loading={isGeneratingAltNames}
                    loadingDots={loadingDots}
                  />
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="altNames"
                  value={formData.altNames}
                  onChange={handleChange}
                  placeholder="Example: ASUS TUF A15, Gaming Laptop, ASUS Laptop"
                  className={`${fieldClass(errors.altNames)} pr-32 ${justGeneratedAltNames ? "border-accent" : ""
                    }`}
                />

                <AIGeneratedTag show={justGeneratedAltNames} />
              </div>

              <FieldError message={errors.altNames} />

              <AIHelperNote>
                AI can generate SEO-friendly search keywords to help customers find
                products faster.
              </AIHelperNote>
            </div>

            {/* Description */}
            <div className="mt-6">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <FieldLabel required>● Description</FieldLabel>
                <AIBadge />
              </div>

              <div className="mb-2 flex justify-end">
                <AIActionButton
                  onClick={handleGenerateDescription}
                  loading={isGeneratingDescription}
                  loadingDots={loadingDots}
                />
              </div>

              <div className="relative">
                <textarea
                  ref={descriptionRef}
                  rows="5"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description..."
                  className={`${fieldClass(errors.description)} resize-none ${justGeneratedDescription ? "border-accent" : ""
                    }`}
                />

                <AIGeneratedTag show={justGeneratedDescription} />
              </div>

              <FieldError message={errors.description} />

              <AIHelperNote>
                AI creates a professional product description based on the product
                name and category.
              </AIHelperNote>
            </div>
          </SectionCard>

          {/* ================= Product Details ================= */}
          <SectionCard

            title="02. Product Details"
            subtitle="Category and manufacturer information."
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Category */}
              <div>
                <FieldLabel required>● Category</FieldLabel>

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
                <FieldLabel>● Brand</FieldLabel>

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
                <FieldLabel>● Model</FieldLabel>

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
          </SectionCard>

          {/* ================= Pricing ================= */}
          <SectionCard

            title="03. Pricing"
            subtitle="Selling price is what customers pay; labelled price shows as the strike-through original."
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Price */}
              <div>
                <FieldLabel required>● Selling Price</FieldLabel>

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
                <FieldLabel required>● Labelled Price</FieldLabel>

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
          </SectionCard>

          {/* ================= Inventory ================= */}
          <SectionCard

            title="04. Inventory"
            subtitle="Stock on hand and whether it's currently purchasable."
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Stock */}
              <div>
                <FieldLabel required>● Stock Quantity</FieldLabel>

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
                <FieldLabel>● Product Status</FieldLabel>

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
          </SectionCard>

          {/* ================= Product Images ================= */}
          <SectionCard

            title="05. Product Images"
            subtitle="Up to 5 images — the first one is used as the primary thumbnail."
          >
            <label
              htmlFor="product-images-input"
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-6 py-10 text-center transition-colors hover:border-accent hover:bg-accent/5 ${errors.images ? "border-rose-300 bg-rose-50/50" : "border-slate-200"
                }`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-accent/10 text-accent">
                <FaImages size={16} />
              </span>
              <p className="text-sm font-medium text-slate-700">
                Click to upload product images
              </p>
              <p className="text-xs text-slate-500">PNG or JPG, up to 5 images</p>

              <input
                ref={imagesRef}
                id="product-images-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <FieldError message={errors.images} />

            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Selected Images:{" "}
                <span className="font-medium text-slate-700">{images.length} / 5</span>
              </p>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="relative overflow-hidden rounded-md border border-slate-200 bg-white"
                  >
                    {index === 0 && (
                      <span className="absolute left-2 top-2 z-10 rounded-md bg-accent px-2 py-0.5 text-[11px] font-semibold text-white">
                        Primary
                      </span>
                    )}

                    <img
                      src={imagePreviewUrls[index]}
                      alt={image.name}
                      loading="lazy"
                      className="h-40 w-full object-contain p-2"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`Remove ${image.name}`}
                    >
                      <FaXmark size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* ================= Buttons ================= */}
        <div className="sticky bottom-0 z-10 mt-6 flex justify-end gap-3 border-t border-slate-200 bg-white p-4">
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