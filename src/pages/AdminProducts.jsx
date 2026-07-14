import { FaPlus, FaSearch, FaBoxOpen} from "react-icons/fa";

import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import {getAllAdminProducts, updateProductAvailability } from "../services/productService";

function AdminProducts() {

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingProductId, setUpdatingProductId] = useState(null);
  
  const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllAdminProducts();
        

        setProducts(data.products);
      } catch (error) {
        console.error("Fetch Products Error:", error);

        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
        fetchProducts();
      }, []);
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

          await fetchProducts();
        } catch (error) {
          console.error("Update Availability Error:", error);

          toast.error("Failed to update product status.");
        } finally {
          setUpdatingProductId(null);
        }
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Search */}
          <div className="relative">

            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
            />

          </div>

          {/* Category */}
          <select
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
          >

            <option>
              All Categories
            </option>

            <option>
              Laptop
            </option>

            <option>
              Desktop
            </option>

            <option>
              Monitor
            </option>

            <option>
              Keyboard
            </option>

            <option>
              Mouse
            </option>

            <option>
              Printer
            </option>

            <option>
              Storage
            </option>

            <option>
              Networking
            </option>

            <option>
              Accessories
            </option>

            <option>
              Other
            </option>

          </select>

        </div>

      </div>
            {/* Products Table */}
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
                    className="border-b border-gray-200 hover:bg-green-50 transition-colors duration-200"
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
                      {product.stock}
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
                      -
                    </td>

                  </tr>
                ))

              )}

            </tbody>
          </table>

        </div>

      </div>

    </AdminLayout>

  );

}


export default AdminProducts;