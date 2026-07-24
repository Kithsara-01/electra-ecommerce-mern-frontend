import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { getAllAdminProducts, updateProductStock } from "../services/productService";

import UpdateStockModal from "../components/UpdateStockModal";
import Swal from "sweetalert2";
import {
  FaBoxOpen,
  FaTriangleExclamation,
  FaCircleExclamation,
  FaMagnifyingGlass,
  FaXmark,
} from "react-icons/fa6";

const FILTERS = ["All", "In Stock", "Low Stock", "Out of Stock"];

// Single source of truth for status colors — the dot used on the product
// thumbnail, the Status column badge, and the filter count chips all pull
// from here so the whole page reads as one consistent language.
const STATUS_STYLES = {
  "Out of Stock": { dot: "bg-rose-500", text: "text-rose-700" },
  "Low Stock": { dot: "bg-amber-500", text: "text-amber-700" },
  "In Stock": { dot: "bg-accent", text: "text-accent" },
};

function AdminStocks() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(() => {
    const value = searchParams.get("filter");
    if (value === "low-stock") {
      return "Low Stock";
    }

    if (value === "out-of-stock") {
      return "Out of Stock";
    }

    return "All";
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const value = searchParams.get("filter");

    if (value === "low-stock") {
      setFilter("Low Stock");
      setCurrentPage(1);
    } else if (value === "out-of-stock") {
      setFilter("Out of Stock");
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch, filter]);

  const fetchProducts = async (page = 1) => {
    try {
      setError(null);

      if (initialLoad) {
        setLoading(true);
      } else {
        setIsSearching(true);
      }

      const response = await getAllAdminProducts({
        page,
        limit: 10,
        search: debouncedSearch,
        stockStatus: filter,
      });

      setProducts(response.products || []);
      setCurrentPage(response.currentPage || 1);
      setTotalPages(response.totalPages || 1);
      setTotalProducts(response.totalProducts || 0);
      setLowStockCount(response.lowStockCount || 0);
      setOutOfStockCount(response.outOfStockCount || 0);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load stock data. Please try again."
      );
    } finally {
      setLoading(false);
      setIsSearching(false);
      setInitialLoad(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return "Low Stock";
    return "In Stock";
  };

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const sortedProducts = [...products].sort((a, b) => {
    const getPriority = (stock) => {
      if (stock === 0) return 0; // Out Of Stock (Highest)
      if (stock <= 5) return 1; // Low Stock
      return 2; // In Stock
    };

    return getPriority(a.stock) - getPriority(b.stock);
  });

  const openStockModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeStockModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const handleSaveStock = async (newStock) => {
    try {
      setSaving(true);

      await updateProductStock(selectedProduct.productId, Number(newStock));

      await Swal.fire({
        icon: "success",
        title: "Stock Updated",
        text: "Product stock has been updated successfully.",
        confirmButtonText: "OK",
      });

      closeStockModal();
      await fetchProducts(currentPage);
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.message || "Failed to update stock.",
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  const summaryCards = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: <FaBoxOpen size={18} />,
      accent: "bg-accent/10 text-accent",
    },
    {
      label: "Low Stock",
      value: lowStockCount,
      icon: <FaTriangleExclamation size={18} />,
      accent: "bg-amber-50 text-amber-600",
    },
    {
      label: "Out of Stock",
      value: outOfStockCount,
      icon: <FaCircleExclamation size={18} />,
      accent: "bg-rose-50 text-rose-600",
    },
  ];

  // ---- Loading skeleton (first load only) ----
  if (loading) {
      return (
        <AdminLayout title="Stock Management">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-accent"></div>

              <p className="text-sm text-slate-600">
                Loading stock data...
              </p>
            </div>
          </div>
        </AdminLayout>
      );
    }

  return (
    <AdminLayout title="Stock Management">
      <div className="space-y-6">
        {/* Page intro — AdminLayout's header already shows the "Stock
            Management" title, so this is just the supporting description. */}
        <p className="text-sm text-slate-500">
          Monitor and manage product inventory across your store.
        </p>

        {/* Error state */}
        {error && (
          <div className="flex items-center justify-between gap-3 rounded border border-rose-200 bg-rose-50 px-4 py-3">
            <p className="text-sm font-medium text-rose-700">{error}</p>
            <button
              onClick={() => fetchProducts(currentPage)}
              className="cursor-pointer whitespace-nowrap rounded-md border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
            >
              Retry
            </button>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="flex items-center justify-between rounded border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{card.value}</p>
              </div>

              <div className={`flex h-11 w-11 items-center justify-center rounded-md ${card.accent}`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Low stock notice */}
        {lowStockCount > 0 && (
          <div className="flex items-center gap-3 rounded border border-amber-200 bg-amber-50 px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-600">
              <FaTriangleExclamation size={14} />
            </span>
            <p className="text-sm font-medium text-amber-800">
              {lowStockCount} product{lowStockCount > 1 ? "s are" : " is"} running low
              on stock and may need restocking soon.
            </p>
          </div>
        )}

        {/* Search + Filters */}
        <div className="rounded border border-slate-200 bg-white p-4 sm:p-5">
          <div className="relative">
            <FaMagnifyingGlass
              size={14}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by product name, product ID, brand or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search products"
              className="w-full rounded-md border border-slate-200 py-2.5 pl-10 pr-9 text-sm text-slate-900 outline-none transition-colors focus:border-accent"
            />

            {searchTerm && (
              <button
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
              >
                <FaXmark size={14} />
              </button>
            )}
          </div>

          {/* Segmented filter control */}
          <div className="mt-4 inline-flex flex-wrap gap-1 rounded-md border border-slate-200 bg-slate-50 p-1">
            {FILTERS.map((item) => {
              const count =
                item === "Low Stock"
                  ? lowStockCount
                  : item === "Out of Stock"
                  ? outOfStockCount
                  : null;

              const isActive = filter === item;

              return (
                <button
                  key={item}
                  onClick={() => {
                    setFilter(item);
                    setCurrentPage(1);
                  }}
                  aria-pressed={isActive}
                  className={`flex cursor-pointer items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "border border-accent bg-white text-accent"
                      : "border border-transparent text-slate-600 hover:text-accent"
                  }`}
                >
                  {item}

                  {count > 0 && (
                    <span
                      className={`flex h-5 min-w-[20px] items-center justify-center rounded px-1 text-[11px] font-bold ${
                        isActive
                          ? "bg-accent text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stock Table */}
        <div className="overflow-hidden rounded border border-slate-200 bg-white">
          <div
            className={`overflow-x-auto transition-opacity ${
              isSearching ? "opacity-50" : "opacity-100"
            }`}
          >
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Product ID</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3 text-center">Stock</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-center">Updated</th>
                  <th className="px-5 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {sortedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                          <FaBoxOpen size={18} />
                        </span>
                        <p className="text-sm font-medium text-slate-700">
                          No products found
                        </p>
                        <p className="text-xs text-slate-500">
                          {debouncedSearch || filter !== "All"
                            ? "Try adjusting your search or filter."
                            : "Products you add will appear here."}
                        </p>
                        {(debouncedSearch || filter !== "All") && (
                          <button
                            onClick={() => {
                              clearSearch();
                              setFilter("All");
                            }}
                            className="mt-1 cursor-pointer rounded-md border border-accent bg-white px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
                          >
                            Reset filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedProducts.map((product) => {
                    const status = getStockStatus(product.stock);
                    const style = STATUS_STYLES[status];

                    return (
                      <tr
                        key={product._id}
                        className="transition-colors hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {/* Thumbnail with status dot pinned to the corner */}
                            <div className="relative h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 overflow-hidden rounded-md border border-slate-200 bg-white p-1">
                                <img
                                  src={
                                    product.images?.[0] ||
                                    "https://placehold.co/80x80/FFFFFF/94A3B8?text=No+Image"
                                  }
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

                              {status !== "In Stock" && (
                                <span
                                  className={`absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white ${style.dot}`}
                                  title={status}
                                ></span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-900">
                                {product.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {product.brand || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {product.productId || "N/A"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {product.category || "N/A"}
                        </td>

                        <td className="px-5 py-4 text-center text-sm font-semibold text-slate-900">
                          {product.stock ?? 0}
                        </td>

                        {/* Status badge — outlined with a colored dot, matching the thumbnail indicator */}
                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1 text-xs font-medium">
                            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`}></span>
                            <span className={style.text}>{status}</span>
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center text-sm text-slate-700">
                          {formatDate(product.updatedAt)}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => openStockModal(product)}
                            className="inline-flex cursor-pointer items-center rounded-md border border-accent bg-white px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
                          >
                            Update Stock
                          </button>
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
        {sortedProducts.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-4 sm:flex-row">
            <p className="text-sm text-slate-500">
              Page <span className="font-semibold text-slate-900">{currentPage}</span> of{" "}
              <span className="font-semibold text-slate-900">{totalPages}</span>
              <span className="ml-2 text-slate-400">
                ({totalProducts} product{totalProducts === 1 ? "" : "s"} total)
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1 || isSearching}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                  currentPage === 1 || isSearching
                    ? "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400"
                    : "cursor-pointer border-accent bg-white text-accent hover:bg-accent hover:text-white"
                }`}
              >
                Previous
              </button>

              <button
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage === totalPages || isSearching}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                  currentPage === totalPages || isSearching
                    ? "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400"
                    : "cursor-pointer border-accent bg-white text-accent hover:bg-accent hover:text-white"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <UpdateStockModal
        isOpen={isModalOpen}
        onClose={closeStockModal}
        product={selectedProduct}
        onSave={handleSaveStock}
        saving={saving}
      />
    </AdminLayout>
  );
}

export default AdminStocks;