import { FaPlus, FaSearch, FaBoxOpen, FaEdit, FaTrash } from "react-icons/fa";

import toast from "react-hot-toast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import {
  deleteProduct,
  getAllAdminProducts,
  updateProductAvailability,
} from "../services/productService";

// Status badges: accent for the healthy state, amber for a soft warning,
// rose for the hard-stop "out of stock" state — same scheme used on the
// Stock Management page.
const getStockStatus = (stock) => {
  if (stock === 0) {
    return { label: "Out of Stock", className: "bg-rose-50 text-rose-700" };
  }

  if (stock <= 5) {
    return { label: "Low Stock", className: "bg-amber-50 text-amber-700" };
  }

  return { label: "In Stock", className: "bg-accent/10 text-accent" };
};

function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const fetchProducts = async (
    query = "",
    category = "",
    sort = "newest",
    page = 1
  ) => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 10,
      };

      if (query) {
        params.search = query;
      }

      if (category) {
        params.category = category;
      }

      if (sort) {
        params.sort = sort;
      }

      const data = await getAllAdminProducts(params);

      setProducts(data.products || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      setTotalProducts(data.totalProducts || 0);
    } catch (error) {
      console.error("Fetch Products Error:", error);

      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);

    const timer = setTimeout(() => {
      fetchProducts(searchTerm.trim(), selectedCategory, selectedSort, 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedSort]);

  const handleAvailabilityToggle = async (product) => {
    try {
      setUpdatingProductId(product.productId);

      await updateProductAvailability(product.productId, !product.isAvailable);

      toast.success(
        `Product marked as ${!product.isAvailable ? "Available" : "Not Available"}.`
      );

      await fetchProducts(searchTerm.trim(), selectedCategory, selectedSort, currentPage);
    } catch (error) {
      console.error("Update Availability Error:", error);

      toast.error("Failed to update product status.");
    } finally {
      setUpdatingProductId(null);
    }
  };

  // Replaces the old handleDeleteClick + handleDeleteConfirm pair. The
  // SweetAlert2 dialog itself now handles the confirm/cancel step that the
  // custom modal used to own.
  const handleDelete = async (product) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Product",
      text: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
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
      setDeletingProductId(product.productId);

      await deleteProduct(product.productId);

      await Swal.fire({
        icon: "success",
        title: "Product Deleted",
        text: "The product has been deleted successfully.",
        confirmButtonText: "OK",
      });

      await fetchProducts(searchTerm.trim(), selectedCategory, selectedSort, currentPage);
    } catch (error) {
      console.error("Delete Product Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.response?.data?.message || "Failed to delete product.",
        confirmButtonText: "OK",
      });
    } finally {
      setDeletingProductId(null);
    }
  };

  return (
    <AdminLayout title="Products">
      {/* Page Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-black ">
            <b><i>● Manage all products in your electra store.</i></b>
          </p>

          <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            {totalProducts} {totalProducts === 1 ? "Product" : "Products"}
          </span>
        </div>

        <button
          onClick={() => navigate("/admin/products/add")}
          className="flex cursor-pointer items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary"
        >
          <FaPlus />
          Add Product
        </button>
      </div>

      {/* Search & Filter */}
      <div className="mt-6 rounded border border-slate-200 bg-white p-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-slate-200 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-accent"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="cursor-pointer rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-accent"
          >
            <option value="">All Categories</option>
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

          {/* Sort */}
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="cursor-pointer rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-accent"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="mt-6 overflow-hidden rounded border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                        <FaBoxOpen className="text-3xl text-accent" />
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">
                        No Products Found
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        Click the <span className="font-semibold text-slate-700">"Add Product"</span>{" "}
                        button above to create your first product.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const status = getStockStatus(product.stock);
                  const isDeleting = deletingProductId === product.productId;

                  return (
                    <tr
                      key={product.productId}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="h-14 w-14 overflow-hidden rounded-md border border-slate-200 bg-white p-1">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                "https://placehold.co/80x80/FFFFFF/94A3B8?text=No+Image";
                            }}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {product.name}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {product.category}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        Rs. {product.price.toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-semibold text-slate-900">
                            {product.stock} Units
                          </span>

                          <span
                            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleAvailabilityToggle(product)}
                          disabled={updatingProductId === product.productId}
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold text-white transition-colors ${
                            updatingProductId === product.productId
                              ? "cursor-not-allowed opacity-60"
                              : "cursor-pointer hover:bg-secondary"
                          } ${product.isAvailable ? "bg-accent" : "bg-amber-500"}`}
                        >
                          {updatingProductId === product.productId
                            ? "Updating..."
                            : product.isAvailable
                            ? "Available"
                            : "Not Available"}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            title="Edit Product"
                            onClick={() =>
                              navigate(`/admin/products/edit/${product.productId}`)
                            }
                            className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-slate-500 transition-colors hover:bg-accent/10 hover:text-accent"
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            title="Delete Product"
                            onClick={() => handleDelete(product)}
                            disabled={isDeleting}
                            className={`inline-flex items-center justify-center rounded-md p-2 text-slate-500 transition-colors ${
                              isDeleting
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer hover:bg-rose-50 hover:text-rose-600"
                            }`}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() =>
            fetchProducts(searchTerm.trim(), selectedCategory, selectedSort, currentPage - 1)
          }
          disabled={currentPage === 1 || loading}
          className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
            currentPage === 1 || loading
              ? "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400"
              : "cursor-pointer border-accent bg-white text-accent hover:bg-accent hover:text-white"
          }`}
        >
          Previous
        </button>

        <span className="text-sm text-slate-500">
          Page <span className="font-semibold text-slate-900">{currentPage}</span> of{" "}
          <span className="font-semibold text-slate-900">{totalPages}</span>
        </span>

        <button
          type="button"
          onClick={() =>
            fetchProducts(searchTerm.trim(), selectedCategory, selectedSort, currentPage + 1)
          }
          disabled={currentPage === totalPages || loading}
          className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
            currentPage === totalPages || loading
              ? "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400"
              : "cursor-pointer border-accent bg-white text-accent hover:bg-accent hover:text-white"
          }`}
        >
          Next
        </button>
      </div>
    </AdminLayout>
  );
}

export default AdminProducts;