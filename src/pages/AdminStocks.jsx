import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { getAllAdminProducts, updateProductStock} from "../services/productService";

import UpdateStockModal from "../components/UpdateStockModal";
import Swal from "sweetalert2";

function AdminStocks() {
  // const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getAllAdminProducts({
        limit: 1000,
      });

      setProducts(response.products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock <= 5
  ).length;

  const filteredProducts = products.filter((product) => {
    const keyword = searchTerm.toLowerCase();

    const matchesSearch =
      product.name?.toLowerCase().includes(keyword) ||
      product.productId?.toLowerCase().includes(keyword) ||
      product.category?.toLowerCase().includes(keyword) ||
      product.brand?.toLowerCase().includes(keyword) ||
      product.model?.toLowerCase().includes(keyword);

    if (!matchesSearch) return false;

    const status = getStockStatus(product.stock);

    if (filter === "All") return true;

    return status === filter;
  });

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
        await fetchProducts();
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
            {products.length} Products
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
                onClick={() => setFilter(item)}
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

                {filteredProducts.length === 0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="py-12 text-center text-slate-500"
                    >
                      No products found.
                    </td>

                  </tr>

                ) : (

                  filteredProducts.map((product) => {
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
