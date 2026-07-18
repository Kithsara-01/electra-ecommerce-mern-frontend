import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-hot-toast";

import Header from "../components/Header";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";
import {
  addToWishlist, removeFromWishlist, checkWishlist,} from "../services/wishlistService";

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProductById(productId);

        setProduct(response.product);

        const wishlistResponse = await checkWishlist(response.product._id);

        setIsWishlisted(wishlistResponse.isWishlisted);

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


    const handleWishlist = async () => {
      try {
        setWishlistLoading(true);

        if (isWishlisted) {
          const response = await removeFromWishlist(product._id);

          toast.success(response.message);
          setIsWishlisted(false);
        } else {
          const response = await addToWishlist(product._id);

          toast.success(response.message);
          setIsWishlisted(true);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Wishlist operation failed"
        );
      } finally {
        setWishlistLoading(false);
      }
    };

  if (loading) {
    return (
      <>
         <Header showSearch={false} />

        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-xl text-slate-600">
          Loading Product...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
         <Header showSearch={false} />

        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-red-600">
          {error}
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
         <Header showSearch={false} />

        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-600">
          Product not found.
        </div>
      </>
    );
  }

  return (
    <>
      <Header showSearch={false} />


      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
      >
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <li>
            <Link
              to="/"
              className="font-medium transition-colors hover:text-accent"
            >
              Home
            </Link>
          </li>
          <li className="text-slate-400">/</li>
          <li>
            <Link
              to="/products"
              className="font-medium transition-colors hover:text-accent"
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
              <li className="max-w-[180px] truncate font-semibold text-accent sm:max-w-none">
                {product.name}
              </li>
            </>
          )}
        </ol>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:items-start">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-md border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex h-[330px] items-center justify-center overflow-hidden bg-white sm:h-[360px] lg:h-[400px]">
                <img
                  src={selectedImage || product.images?.[0] || ""}
                  alt={product.name}
                  className="h-full w-full object-contain"
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
                    className={`cursor-pointer overflow-hidden rounded-md border p-1 transition-colors sm:h-24 sm:w-24 ${
                      isActive
                        ? "border-accent"
                        : "border-slate-200 hover:border-accent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="h-20 w-20 rounded object-cover sm:h-24 sm:w-24"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:pt-0">
            <div className="rounded-md border border-slate-200 bg-white p-5 sm:p-6">
              <span className="inline-flex rounded bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                {product.category}
              </span>

              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {product.name}
              </h1>

              <div className="mt-4 space-y-1.5 text-sm text-slate-600">
                <p>Product ID : <span className="font-medium text-slate-800">{product.productId}</span></p>
                <p>Brand : <span className="font-medium text-slate-800">{product.brand || "N/A"}</span></p>
                <p>Model : <span className="font-medium text-slate-800">{product.model || "N/A"}</span></p>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                {product.labelledPrice > product.price && (
                  <p className="text-sm text-slate-400 line-through">
                    {formatPrice(product.labelledPrice)}
                  </p>
                )}

                <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {formatPrice(product.price)}
                </h2>
              </div>

              <div className="mt-4">
                <p
                  className={`inline-flex rounded px-3 py-1 text-sm font-medium ${
                    product.stock > 0
                      ? "bg-accent/10 text-accent"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {product.stock > 0
                    ? `In Stock (${product.stock})`
                    : "Out of Stock"}
                </p>
              </div>

              <div className="mt-5 flex items-stretch gap-3">

                <button
                  onClick={handleAddToCart}
                  className="flex-1 cursor-pointer rounded border border-accent bg-white px-4 py-2.5 text-base font-semibold text-accent transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-white disabled:text-slate-400"
                  disabled={product.stock === 0 || addToCartLoading}
                >
                  {addToCartLoading ? "Adding..." : "Add to Cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 cursor-pointer rounded bg-accent px-4 py-2.5 text-base font-semibold text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:bg-slate-300"
                  disabled={product.stock === 0 || addToCartLoading}
                >
                  {addToCartLoading ? "Processing..." : "Buy Now"}
                </button>

                <button
                type="button"
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className={`flex h-11 w-11 items-center justify-center rounded border transition-colors disabled:cursor-not-allowed ${
                    isWishlisted
                      ? "border-red-500 bg-red-50"
                      : "border-slate-300 hover:border-accent hover:bg-accent/10"
                  }`}
              >
                {isWishlisted ? (
                    <FaHeart size={18} className="text-red-500" />
                  ) : (
                    <FaRegHeart size={18} />
                  )}
              </button>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
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