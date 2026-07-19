import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { getAllAdminProducts, updateProductStock} from "../services/productService";

import UpdateStockModal from "../components/UpdateStockModal";
import Swal from "sweetalert2";

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
}, [currentPage, debouncedSearch, filter]);

const fetchProducts = async (page = 1) => {
  try {
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

    console.log("Admin Products Response:", response);

    setProducts(response.products || []);
    setCurrentPage(response.currentPage || 1);
    setTotalPages(response.totalPages || 1);
    setTotalProducts(response.totalProducts || 0);
    setLowStockCount(response.lowStockCount || 0);
    setOutOfStockCount(response.outOfStockCount || 0);
    setInitialLoad(false);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
    setIsSearching(false);
  }
};

  const getStockStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return "Low Stock";
    return "In Stock";
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "Out of Stock":
        return "border-rose-300 bg-rose-50 text-rose-700";
      case "Low Stock":
        return "border-amber-300 bg-amber-50 text-amber-700";
      default:
        return "border-emerald-300 bg-emerald-50 text-emerald-700";
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

  
 

  const openStockModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    };

  const closeStockModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    };

  const handleSaveStock = async (newStock) => {
    try {
        setSaving(true);

        await updateProductStock(
        selectedProduct.productId,
        Number(newStock)
        );

        await Swal.fire({
        icon: "success",
        title: "Stock Updated",
        text: "Product stock has been updated successfully.",
        confirmButtonText: "OK",
        });

        closeStockModal();
        await fetchProducts(currentPage);
    } catch (error) {
        await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
            error.response?.data?.message ||
            "Failed to update stock.",
        confirmButtonText: "OK",
        });
    } finally {
        setSaving(false);
    }
    };

  if (loading) {
    return (
      <AdminLayout title="Stock Management">
        <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-secondary">Loading stock...</h2>
          <p className="mt-2 text-sm text-slate-600">
            Please wait while we fetch product inventory.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Stock Management">
      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-semibold text-secondary">
              Stock Management
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Monitor and manage product inventory across your store.
            </p>
          </div>

          <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            {totalProducts} Products
          </span>

        </div>

        {lowStockCount > 0 && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm font-medium text-amber-700">
              ⚠ {lowStockCount} product{lowStockCount > 1 ? "s are" : " is"} running
              low on stock.
            </p>
          </div>
        )}

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">

          <input
            type="text"
            placeholder="Search by product name, product ID, brand or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-accent"
          />

          <div className="flex flex-wrap gap-3">

            {["All", "In Stock", "Low Stock", "Out of Stock"].map((item) => (

              <button
                key={item}
                onClick={() => {
                    setFilter(item);
                    setCurrentPage(1);
                  }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition
                ${
                  filter === item
                    ? "border-accent bg-accent text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-accent hover:text-accent"
                }`}
              >
                {item}
              </button>

            ))}

          </div>

        </div>

        {/* Stock Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-50">

                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">

                  <th className="px-5 py-4">Product</th>

                  <th className="px-5 py-4">Product ID</th>

                  <th className="px-5 py-4">Category</th>

                  <th className="px-5 py-4 text-center">Stock</th>

                  <th className="px-5 py-4 text-center">Status</th>

                  <th className="px-5 py-4 text-center">Updated</th>

                  <th className="px-5 py-4 text-center">Action</th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-200">

                {products.length === 0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="py-12 text-center text-slate-500"
                    >
                      No products found.
                    </td>

                  </tr>

                ) : (

                  products.map((product) => {
                    const status = getStockStatus(product.stock);

                    return (
                      <tr
                        key={product._id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                              <img
                                src={
                                  product.images?.[0] ||
                                  "https://placehold.co/80x80/E6F6F1/2FA084?text=No+Image"
                                }
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
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

                        <td className="px-5 py-4 text-center">
                            <span
                                className={`text-sm font-semibold ${
                                product.stock === 0
                                    ? "text-rose-600"
                                    : product.stock <= 5
                                    ? "text-amber-600"
                                    : "text-slate-900"
                                }`}
                            >
                                {product.stock ?? 0}
                            </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusBadgeClasses(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center text-sm text-slate-700">
                          {formatDate(product.updatedAt)}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => openStockModal(product)}
                            className="inline-flex items-center rounded-lg bg-accent/10 px-3 py-2 text-sm font-medium text-accent transition hover:bg-accent/20"
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

      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-4 sm:flex-row">
        <p className="text-sm text-slate-600">
          Page <span className="font-semibold">{currentPage}</span> of{" "}
          <span className="font-semibold">{totalPages}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((page) => page - 1)}
            disabled={currentPage === 1 || isSearching}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
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
           className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            currentPage === totalPages || isSearching
              ? "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400"
              : "cursor-pointer border-accent bg-white text-accent hover:bg-accent hover:text-white"
          }`}
          >
            Next
          </button>
        </div>
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
