import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Header from "../components/Header";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProductById(productId);

        setProduct(response.product);

        if (response.product.images?.length > 0) {
          setSelectedImage(response.product.images[0]);
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(price || 0);

  const handleAddToCart = async () => {
    try {
      setAddToCartLoading(true);
      const response = await addToCart({
        productId: product._id,
        quantity: 1,
      });
      toast.success(response.message || "Product added to cart successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add product to cart"
      );
    } finally {
      setAddToCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
      try {
        setAddToCartLoading(true);

        const response = await addToCart({
          productId: product._id,
          quantity: 1,
        });

        toast.success(response.message || "Product added to cart");

        navigate("/checkout");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to process Buy Now"
        );
      } finally {
        setAddToCartLoading(false);
      }
    };

  if (loading) {
    return (
      <>
        <Header />

        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-xl text-slate-600">
          Loading Product...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />

        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-red-600">
          {error}
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />

        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-600">
          Product not found.
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
      >
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 sm:text-base">
          <li>
            <Link
              to="/"
              className="font-medium transition-colors duration-200 hover:text-[#2FA084]"
            >
              Home
            </Link>
          </li>
          <li className="text-slate-400">/</li>
          <li>
            <Link
              to="/products"
              className="font-medium transition-colors duration-200 hover:text-[#2FA084]"
            >
              Products
            </Link>
          </li>
          {product?.category && (
            <>
              <li className="text-slate-400">/</li>
              <li className="font-medium text-slate-700">{product.category}</li>
            </>
          )}
          {product?.name && (
            <>
              <li className="text-slate-400">/</li>
              <li className="max-w-[180px] truncate font-semibold text-[#2FA084] sm:max-w-none">
                {product.name}
              </li>
            </>
          )}
        </ol>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:items-center">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.25)] sm:p-5">
              <div className="overflow-hidden rounded-xl bg-slate-50">
                <img
                  src={selectedImage || product.images?.[0] || ""}
                  alt={product.name}
                  className="mx-auto h-[330px] w-full object-contain transition duration-300 ease-out hover:scale-[1.03] sm:h-[360px] lg:h-[400px]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {(product.images || []).map((image, index) => {
                const isActive = selectedImage === image;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`group relative overflow-hidden rounded-xl border-2 p-1 transition duration-300 ease-out sm:h-24 sm:w-24 ${
                      isActive
                        ? "scale-[1.03] border-[#2FA084] shadow-md ring-2 ring-[#2FA084]/20"
                        : "border-slate-200 hover:scale-[1.02] hover:border-[#2FA084]/50 hover:shadow-sm"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="h-20 w-20 rounded-lg object-cover transition duration-300 group-hover:scale-105 sm:h-24 sm:w-24"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:pt-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <span className="inline-flex rounded-full bg-[#2FA084] px-3 py-1 text-sm font-medium text-white">
                {product.category}
              </span>

              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {product.name}
              </h1>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p className="font-medium">Product ID : {product.productId}</p>
                <p className="font-medium">Brand : {product.brand || "N/A"}</p>
                <p className="font-medium">Model : {product.model || "N/A"}</p>
              </div>

              <div className="mt-5 border-t border-slate-200 pt-4">
                <p className="text-base text-slate-400 line-through">
                  {formatPrice(product.labelledPrice)}
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#2FA084] sm:text-3xl">
                  {formatPrice(product.price)}
                </h2>
              </div>

              <div className="mt-4">
                <p
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    product.stock > 0
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {product.stock > 0
                    ? `In Stock (${product.stock})`
                    : "Out of Stock"}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-xl bg-[#2FA084] px-4 py-2.5 text-base font-semibold text-white transition hover:bg-[#267d67] disabled:cursor-not-allowed disabled:bg-gray-400"
                  disabled={product.stock === 0 || addToCartLoading}
                >
                  {addToCartLoading ? "Adding..." : "Add to Cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 cursor-pointer rounded-xl border border-[#2FA084] px-4 py-2.5 text-base font-semibold text-[#2FA084] transition hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
                  disabled={product.stock === 0 || addToCartLoading}
                >
                  {addToCartLoading ? "Processing..." : "Buy Now"}
                </button>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Description
                </h2>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;