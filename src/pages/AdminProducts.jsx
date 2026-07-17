import { FaPlus, FaSearch, FaBoxOpen, FaEdit, FaTrash } from "react-icons/fa";

import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import {
  deleteProduct,
  getAllAdminProducts,
  updateProductAvailability,
} from "../services/productService";

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
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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

          await updateProductAvailability(
            product.productId,
            !product.isAvailable
          );

          toast.success(
            `Product marked as ${
              !product.isAvailable ? "Available" : "Not Available"
            }.`
          );

          await fetchProducts(searchTerm.trim(), selectedCategory, selectedSort, currentPage);
        } catch (error) {
          console.error("Update Availability Error:", error);

          toast.error("Failed to update product status.");
        } finally {
          setUpdatingProductId(null);
        }
      };

      const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
      };

      const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedProduct(null);
        setDeletingProductId(null);
      };

      const handleDeleteConfirm = async () => {
        if (!selectedProduct) return;

        try {
          setDeletingProductId(selectedProduct.productId);

          await deleteProduct(selectedProduct.productId);

          toast.success("Product deleted successfully.");
          closeDeleteModal();
          await fetchProducts(searchTerm.trim(), selectedCategory, selectedSort, currentPage);
        } catch (error) {
          console.error("Delete Product Error:", error);
          toast.error("Failed to delete product.");
        } finally {
          setDeletingProductId(null);
        }
      };

      const getStockStatus = (stock) => {
        if (stock === 0) {
          return {
            label: "Out of Stock",
            className: "bg-red-100 text-red-700",
          };
        }

        if (stock <= 5) {
          return {
            label: "Low Stock",
            className: "bg-yellow-100 text-yellow-700",
          };
        }

        return {
          label: "In Stock",
          className: "bg-green-100 text-green-700",
        };
      };



  return (
    <AdminLayout title="Products">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

        <div>
          

          <p className="mt-2 text-lg font-medium text-gray-700">
            Manage all products in your electronic store.
          </p> 
        </div>

        {/* Add Product Button */}
        <button
          onClick={() => navigate("/admin/products/add")}
          className="flex items-center gap-3 bg-accent text-white px-6 py-3 rounded-xl shadow-md hover:bg-teal-700 transition duration-300 cursor-pointer"
        >
          <FaPlus />

          <span className="font-semibold">
            Add Product
          </span>

        </button>

      </div>

      {/* Search & Filter */}
      <div className="mt-10 bg-white rounded-3xl shadow-xl p-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Search */}
          <div className="relative">

            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
            />

          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
          >

            <option value="">
              All Categories
            </option>

            <option value="Laptop">
              Laptop
            </option>

            <option value="Desktop">
              Desktop
            </option>

            <option value="Monitor">
              Monitor
            </option>

            <option value="Keyboard">
              Keyboard
            </option>

            <option value="Mouse">
              Mouse
            </option>

            <option value="Printer">
              Printer
            </option>

            <option value="Storage">
              Storage
            </option>

            <option value="Networking">
              Networking
            </option>

            <option value="Accessories">
              Accessories
            </option>

            <option value="Other">
              Other
            </option>

          </select>

          {/* Sort */}
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
          >

            <option value="newest">
              Newest
            </option>

            <option value="oldest">
              Oldest
            </option>

            <option value="priceLow">
              Price: Low to High
            </option>

            <option value="priceHigh">
              Price: High to Low
            </option>

          </select>

        </div>

      </div>

      
      <div className="mt-8 bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                  Image
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                  Product
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                  Price
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                  Stock
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-secondary">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>
              {products.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="py-20 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-5">

                        <FaBoxOpen className="text-4xl text-accent" />

                      </div>

                      <h3 className="text-2xl font-bold text-secondary">

                        No Products Found

                      </h3>

                      <p className="text-gray-500 mt-3">
                        Click the <span className="font-semibold">"Add Product"</span> button above
                        to create your first product.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

               products.map((product) => (
                  <tr
                    key={product.productId}
                    className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                  >

                    <td className="px-6 py-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {product.name}
                    </td>

                    <td className="px-6 py-4">
                      {product.category}
                    </td>

                    <td className="px-6 py-4">
                      Rs. {product.price.toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold text-secondary">
                          {product.stock} Units
                        </span>

                        <span
                          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                            getStockStatus(product.stock).className
                          }`}
                        >
                          {getStockStatus(product.stock).label}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex flex-col items-start gap-3">

                        <button
                            type="button"
                            onClick={() => handleAvailabilityToggle(product)}
                            disabled={updatingProductId === product.productId}
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                              updatingProductId === product.productId
                                ? "opacity-60 cursor-not-allowed"
                                : "cursor-pointer hover:scale-105"
                            } ${
                              product.isAvailable
                                ? "bg-green-700 text-white hover:bg-green-600"
                                : "bg-yellow-700 text-white hover:bg-yellow-600"
                            }`}
                        >
                          {updatingProductId === product.productId
                            ? "Updating..."
                            : product.isAvailable
                            ? "Available"
                            : "Not Available"}
                        </button>

                       
                      </div>

                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          title="Edit Product"
                          onClick={() => navigate(`/admin/products/edit/${product.productId}`)}
                          className="inline-flex items-center justify-center rounded-full p-2 text-gray-600 transition duration-200 ease-out cursor-pointer text-lg hover:scale-105 hover:text-[#2FA084] hover:bg-green-100"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          title="Delete Product"
                          onClick={() => handleDeleteClick(product)}
                          className="inline-flex items-center justify-center rounded-full p-2 text-gray-600 transition duration-200 ease-out cursor-pointer text-lg hover:scale-105 hover:text-red-600 hover:bg-red-100"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))

              )}

            </tbody>
          </table>

        </div>

      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => fetchProducts(searchTerm.trim(), selectedCategory, selectedSort, currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Previous
        </button>

        <span className="text-sm font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => fetchProducts(searchTerm.trim(), selectedCategory, selectedSort, currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Next
        </button>
      </div>

      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <FaTrash className="text-xl text-red-600" />
            </div>

            <h3 className="text-center text-xl font-semibold text-secondary">
              Delete Product
            </h3>

            <p className="mt-3 text-center text-sm leading-6 text-gray-600">
              Are you sure you want to delete this product?
              <br />
              This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deletingProductId === selectedProduct.productId}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${
                  deletingProductId === selectedProduct.productId
                    ? "cursor-not-allowed bg-red-400"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {deletingProductId === selectedProduct.productId
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>

  );

}


export default AdminProducts;