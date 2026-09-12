import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import toast from "react-hot-toast";

import {
  getAllReviews,
  deleteReview,
} from "../services/reviewService";

import AdminLayout from "../components/AdminLayout";

import {
  FaStar,
  FaBoxOpen,
  FaExclamationCircle,
  FaCommentSlash,
  FaTrashAlt,
  FaSearch,
} from "react-icons/fa";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllReviews();

      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load reviews";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    const result = await Swal.fire({
      title: "Delete Review?",
      text: "This review will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeletingId(reviewId);

      const data = await deleteReview(reviewId);

      if (data.success) {
        setReviews((prev) =>
          prev.filter((review) => review._id !== reviewId)
        );

        toast.success("Review deleted successfully");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete review";

      toast.error(message);
    } finally {
      setDeletingId("");
    }
  };

  const formatDate = (value) => {
    if (!value) return "N/A";

    return new Date(value).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Search reviews by Product Name or Product ID
  const filteredReviews = reviews.filter((review) => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return true;
    }

    const productName =
      review.product?.name?.toLowerCase() || "";

    const productId =
      review.product?.productId?.toLowerCase() || "";

    return (
      productName.includes(search) ||
      productId.includes(search)
    );
  });

  if (loading) {
    return (
      <AdminLayout title="Admin Reviews">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-accent"></div>

            <p className="text-sm text-slate-600">
              Loading reviews...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Admin Reviews">
        <div className="flex min-h-[420px] items-center justify-center rounded-md border border-rose-200 bg-rose-50 p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-rose-100">
              <FaExclamationCircle
                className="h-6 w-6 text-rose-700"
                aria-hidden="true"
              />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              Unable to load reviews
            </h2>

            <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">
              {error}
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Admin Reviews">
      <div className="rounded-md border border-slate-200 bg-white p-4 sm:p-6">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <p className="mt-1 text-sm text-black">
              <b>
                <i>
                  ● Monitor customer feedback and remove inappropriate
                  reviews.
                </i>
              </b>
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">

            {/* Search */}
            <div className="relative w-full sm:w-80">
              <FaSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />

              <input
                type="text"
                placeholder="Search product name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-accent"
              />
            </div>

            {/* Review Count */}
            <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
              <FaStar
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />

              {searchTerm.trim()
                ? `${filteredReviews.length} ${
                    filteredReviews.length === 1
                      ? "result"
                      : "results"
                  }`
                : `${reviews.length} ${
                    reviews.length === 1
                      ? "review"
                      : "reviews"
                  }`}
            </span>
          </div>
        </div>

        {/* No Search Results */}
        {filteredReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-slate-200 px-6 py-16 text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-slate-100">
              <FaCommentSlash
                className="h-6 w-6 text-slate-400"
                aria-hidden="true"
              />
            </div>

            <p className="text-sm font-semibold text-slate-700">
              {searchTerm.trim()
                ? "No Reviews Found"
                : "No Customer Reviews"}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {searchTerm.trim()
                ? "No reviews match the product name or product ID you entered."
                : "There are currently no customer reviews to manage."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {filteredReviews.map((review) => (
              <div
                key={review._id}
                className="rounded-md border border-slate-200 p-5 transition-colors duration-150 hover:bg-accent/5"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                  {/* Review Information */}
                  <div className="min-w-0 flex-1">

                    {/* Product */}
                    <div className="flex items-start gap-4">

                      {review.product?.image ? (
                        <img
                          src={review.product.image}
                          alt={review.product.name || "Product"}
                          className="h-14 w-14 rounded-md border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-slate-100">
                          <FaBoxOpen
                            className="h-5 w-5 text-slate-400"
                            aria-hidden="true"
                          />
                        </div>
                      )}

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <h2 className="text-sm font-semibold text-slate-900">
                            {review.product?.name ||
                              "Product unavailable"}
                          </h2>

                          {review.product?.productId && (
                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold tracking-tight text-slate-700">
                              #{review.product.productId}
                            </span>
                          )}

                        </div>

                        <p className="mt-1 text-xs text-slate-400">
                          Product Review
                        </p>

                      </div>
                    </div>

                    {/* Customer */}
                    <div className="mt-4 rounded-md border border-slate-100 bg-slate-50 p-3.5">

                      <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">

                        <div>
                          <span className="text-xs text-slate-500">
                            Customer
                          </span>

                          <p className="font-semibold text-slate-900">
                            {review.customer?.name || "Unknown"}
                          </p>
                        </div>

                        <div>
                          <span className="text-xs text-slate-500">
                            Email
                          </span>

                          <p className="font-medium text-slate-700">
                            {review.customer?.email || "N/A"}
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* Rating */}
                    <div className="mt-4 flex items-center gap-3">

                      <span className="text-sm font-semibold text-slate-700">
                        Rating
                      </span>

                      <div className="flex items-center gap-0.5">

                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "text-amber-400"
                                : "text-slate-200"
                            }`}
                            aria-hidden="true"
                          />
                        ))}

                      </div>

                      <span className="text-sm font-semibold text-slate-600">
                        {review.rating}/5
                      </span>

                    </div>

                    {/* Comment */}
                    <div className="mt-4 rounded-md border border-slate-200 bg-white p-3.5">

                      <p className="text-sm leading-6 text-slate-700">
                        "{review.comment}"
                      </p>

                    </div>

                    {/* Date */}
                    <p className="mt-3 text-xs text-slate-400">
                      Reviewed on {formatDate(review.createdAt)}
                    </p>

                  </div>

                  {/* Delete Button */}
                  <div className="shrink-0">

                    <button
                      onClick={() => handleDelete(review._id)}
                      disabled={deletingId === review._id}
                      className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 lg:w-auto"
                    >
                      <FaTrashAlt
                        className="h-3 w-3"
                        aria-hidden="true"
                      />

                      {deletingId === review._id
                        ? "Deleting..."
                        : "Delete Review"}
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminReviews;