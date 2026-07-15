import { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { getAllProducts } from "../services/productService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, selectedBrands, minPrice, maxPrice, sort, inStockOnly, outOfStockOnly]);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllProducts({
          page: currentPage,
          limit: 20,
          search: searchTerm || undefined,
          category: selectedCategories.length ? selectedCategories.join(",") : undefined,
          brand: selectedBrands.length ? selectedBrands.join(",") : undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort: sort || undefined,
        });

        const productList = response.products || [];

        if (isMounted) {
          setProducts(productList);
          setCurrentPage(response.currentPage || 1);
          setTotalPages(response.totalPages || 1);
          setTotalProducts(response.totalProducts || 0);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              "Something went wrong while loading products."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [currentPage, searchTerm, selectedCategories, selectedBrands, minPrice, maxPrice, sort]);

  const categories = Array.from(
    new Set(products.map((product) => product?.category).filter(Boolean))
  );

  const brands = Array.from(
    new Set(products.map((product) => product?.brand).filter(Boolean))
  );

  const displayProducts = products.filter((product) => {
    const stock = Number(product?.stock) || 0;

    return (
      (!inStockOnly && !outOfStockOnly) ||
      (inStockOnly && outOfStockOnly) ||
      (inStockOnly && stock > 0) ||
      (outOfStockOnly && stock === 0)
    );
  });

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setOutOfStockOnly(false);
    setSort("");
    setCurrentPage(1);
  };

  const startItem = totalProducts === 0 ? 0 : (currentPage - 1) * 20 + 1;
  const endItem = totalProducts === 0 ? 0 : Math.min(currentPage * 20, totalProducts);

  const getVisiblePageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

  const visiblePageNumbers = getVisiblePageNumbers();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header showSearch={false} />
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onReset={() => setSearchTerm("")}
      />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-widest text-[#2FA084]">
              Welcome to Electra
            </p>

            <h3 className="text-4xl font-bold text-slate-900">
              Shop Your Favourite Items
            </h3>
          </div>

          <p className="text-sm text-slate-600">
            Browse our latest collection with clean, modern product cards.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:w-[260px] lg:flex-shrink-0">
            <div className="space-y-6">
              {categories.length > 0 && (
                <div>
                  <h4 className="text-base font-semibold text-slate-900">
                    Categories
                  </h4>
                  <div className="mt-3 space-y-2 text-[15px] text-slate-700">
                    {categories.map((item) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          checked={selectedCategories.includes(item)}
                          onChange={() => toggleCategory(item)}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {brands.length > 0 && (
                <div>
                  <h4 className="text-base font-semibold text-slate-900">
                    Brands
                  </h4>
                  <div className="mt-3 space-y-2 text-[15px] text-slate-700">
                    {brands.map((item) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          checked={selectedBrands.includes(item)}
                          onChange={() => toggleBrand(item)}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-base font-semibold text-slate-900">
                  Price Range
                </h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-base font-semibold text-slate-900">
                  Availability
                </h4>
                <div className="mt-3 space-y-2 text-[15px] text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>In Stock</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={outOfStockOnly}
                      onChange={(e) => setOutOfStockOnly(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Out of Stock</span>
                  </label>
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="w-full cursor-pointer rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-black"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          <div className="flex-1">
            {!loading && !error && (
              <div className="mb-4 text-sm font-medium text-slate-600">
                Showing {startItem}–{endItem} of {totalProducts} Products
              </div>
            )}

            {loading ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="h-40 bg-slate-200" />

                    <div className="space-y-2 p-3">
                      <div className="h-4 w-3/4 rounded bg-slate-200" />
                      <div className="h-3 w-1/2 rounded bg-slate-200" />
                      <div className="h-3 w-2/3 rounded bg-slate-200" />
                      <div className="h-8 w-full rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
                <h2 className="text-lg font-semibold">
                  Unable to load products
                </h2>

                <p className="mt-2 text-sm">{error}</p>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  No products available yet
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Please check back later for new arrivals.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {displayProducts.map((product) => (
                    <ProductCard
                      key={product.productId}
                      product={product}
                    />
                  ))}
                </div>

                {!loading && !error && totalProducts > 0 && (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        currentPage === 1
                          ? "cursor-not-allowed border-slate-200 text-slate-400"
                          : "cursor-pointer border-slate-300 text-slate-700 hover:border-[#2FA084] hover:text-[#2FA084]"
                      }`}
                    >
                      &lt; Previous
                    </button>

                    {visiblePageNumbers.map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`h-10 w-10 rounded-full border text-sm font-semibold transition ${
                          currentPage === page
                            ? "border-[#2FA084] bg-[#2FA084] text-white"
                            : "border-slate-300 text-slate-700 hover:border-[#2FA084] hover:text-[#2FA084]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        currentPage === totalPages
                          ? "cursor-not-allowed border-slate-200 text-slate-400"
                          : "cursor-pointer border-slate-300 text-slate-700 hover:border-[#2FA084] hover:text-[#2FA084]"
                      }`}
                    >
                      Next &gt;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;
