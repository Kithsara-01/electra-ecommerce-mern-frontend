import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

import Header from "../components/Header";
import ReviewCard from "../components/ReviewCard";
import StarRating from "../components/StarRating";
import { useAuth } from "../context/AuthContext";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../services/reviewService";


import {
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} from "../services/wishlistService";

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const hasUserReviewed = reviews.some(
      (review) => review.customer?._id === user?._id
    );

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
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
        try {
          const response = await getProductReviews(productId);
          setReviews(response.reviews);
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to load reviews."
          );
        }
      };


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


    const handleSubmitReview = async () => {

        if (!user) {
            toast.error("Please login to submit a review.");
            navigate("/login");
            return;
          }

          if (!comment.trim()) {
            toast.error("Please write your review.");
            return;
          }

          if (comment.trim().length < 10) {
            toast.error("Review must contain at least 10 characters.");
            return;
          }

          if (comment.trim().length > 500) {
            toast.error("Review cannot exceed 500 characters.");
            return;
          }
      try {
        setReviewLoading(true);

        const reviewData = {
          productId: product.productId,
          rating,
          comment,
        };

        if (editingReviewId) {
          await updateReview(editingReviewId, reviewData);
          toast.success("Review updated successfully.");
        } else {
          await createReview(reviewData);
          toast.success("Review added successfully.");
        }

        setComment("");
        setRating(5);
        setEditingReviewId(null);

        fetchReviews();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to save review."
        );
      } finally {
        setReviewLoading(false);
      }
    };


    const handleEditReview = (review) => {
      setEditingReviewId(review._id);
      setRating(review.rating);
      setComment(review.comment);

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    };


    const handleDeleteReview = async (id) => {
      const result = await Swal.fire({
        title: "Delete Review?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (!result.isConfirmed) return;

      try {
        await deleteReview(id);

        toast.success("Review deleted successfully.");

        fetchReviews();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete review."
        );
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

                

                <div className="mt-3 flex items-center gap-3">
                  <StarRating
                    rating={Math.round(product.averageRating || 0)}
                    readOnly
                    size={18}
                  />

                  <span className="text-sm text-slate-600">
                    {(product.averageRating || 0).toFixed(1)}
                  </span>

                  <span className="text-sm text-slate-400">
                    ({product.totalReviews || 0} Reviews)
                  </span>
                </div>
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

        {/* Reviews Section */}

        <div className="mt-10 rounded-md border border-slate-200 bg-white p-6">
          <h2 className="mb-6 text-2xl font-semibold">
            Customer Reviews
          </h2>

          {!user ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm text-amber-700">
                Please login to write a review.
              </p>
            </div>
          ) : hasUserReviewed && !editingReviewId ? (
            <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-700">
                You have already reviewed this product.
                <br />
                Use the Edit button below if you want to update your review.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Your Rating
                </label>

                <StarRating
                  rating={rating}
                  onChange={setRating}
                />
              </div>

              <textarea
                rows={4}
                value={comment}
                maxLength={500}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review..."
                className="w-full rounded border p-3"
              />

              <div className="mt-1 text-right text-xs text-slate-500">
                {comment.length}/500
              </div>

              <button
                onClick={handleSubmitReview}
                disabled={reviewLoading}
                className="rounded bg-accent px-5 py-2 text-white"
              >
                {reviewLoading
                  ? editingReviewId
                    ? "Updating..."
                    : "Submitting..."
                  : editingReviewId
                  ? "Update Review"
                  : "Submit Review"}
              </button>
            </div>
          )}

          <hr className="my-8" />

          <div className="space-y-5">
            {reviews.length === 0 ? (
              <p className="text-slate-500">
                No reviews yet.
              </p>
            ) : (
              reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  currentUser={user}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;