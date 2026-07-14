import {
  FaPlus,
  FaSearch,
  FaBoxOpen,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";



function AdminProducts() {

  const navigate = useNavigate();

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

            </tbody>

          </table>

        </div>

      </div>

    </AdminLayout>

  );

}


export default AdminProducts;