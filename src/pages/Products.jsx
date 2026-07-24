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

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    minPrice ||
    maxPrice ||
    inStockOnly ||
    outOfStockOnly;



  return (
    <div className="min-h-screen bg-slate-50">
      <Header showSearch={false} />

      {/* Hero */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Electra Store
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
                Explore Electronics
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Find the latest laptops, accessories, networking devices and
                more from trusted brands.
              </p>
            </div>

            <div className="w-full lg:max-w-md">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onReset={() => setSearchTerm("")}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full self-start rounded-md border border-slate-200 bg-white p-4 lg:sticky lg:top-4 lg:w-[260px] lg:flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Filters
              </h3>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="cursor-pointer text-xs font-medium text-accent transition-colors hover:text-secondary"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="mt-4 space-y-5">
              {categories.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Categories
                  </h4>
                  <div className="mt-3 space-y-2.5 text-sm text-slate-700">
                    {categories.map((item) => (
                      <label
                        key={item}
                        className="flex cursor-pointer items-center gap-2.5 transition-colors hover:text-accent"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 cursor-pointer rounded border-slate-300 text-accent accent-accent focus:ring-accent focus:ring-offset-0"
                          checked={selectedCategories.includes(item)}
                          onChange={() => toggleCategory(item)}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {categories.length > 0 && brands.length > 0 && (
                <div className="border-t border-slate-100" />
              )}

              {brands.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Brands
                  </h4>
                  <div className="mt-3 space-y-2.5 text-sm text-slate-700">
                    {brands.map((item) => (
                      <label
                        key={item}
                        className="flex cursor-pointer items-center gap-2.5 transition-colors hover:text-accent"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 cursor-pointer rounded border-slate-300 text-accent accent-accent focus:ring-accent focus:ring-offset-0"
                          checked={selectedBrands.includes(item)}
                          onChange={() => toggleBrand(item)}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100" />

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Price Range
                </h4>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded border border-slate-200 px-2.5 py-1.5 text-sm outline-none transition-colors focus:border-accent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded border border-slate-200 px-2.5 py-1.5 text-sm outline-none transition-colors focus:border-accent"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100" />

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Availability
                </h4>
                <div className="mt-3 space-y-2.5 text-sm text-slate-700">
                  <label className="flex cursor-pointer items-center gap-2.5 transition-colors hover:text-accent">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 text-accent accent-accent focus:ring-accent focus:ring-offset-0"
                    />
                    <span>In Stock</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2.5 transition-colors hover:text-accent">
                    <input
                      type="checkbox"
                      checked={outOfStockOnly}
                      onChange={(e) => setOutOfStockOnly(e.target.checked)}
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 text-accent accent-accent focus:ring-accent focus:ring-offset-0"
                    />
                    <span>Out of Stock</span>
                  </label>
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="w-full cursor-pointer rounded border border-slate-300 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-accent hover:bg-accent hover:text-white"
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
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-accent"></div>

                  <p className="text-sm text-slate-600">
                    Loading products...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-8 text-center text-red-700">
                <h2 className="text-lg font-semibold">
                  Unable to load products
                </h2>

                <p className="mt-2 text-sm">{error}</p>
              </div>
            ) : displayProducts.length === 0 ? (
            
            <div className="rounded-md border border-slate-200 bg-white p-10 text-center">
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
                    className={`rounded border px-4 py-2 text-sm font-medium transition-colors ${currentPage === 1
                        ? "cursor-not-allowed border-slate-200 text-slate-400"
                        : "cursor-pointer border-slate-300 text-slate-700 hover:border-accent hover:text-accent"
                      }`}
                  >
                    &lt; Previous
                  </button>

                  {visiblePageNumbers.map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 w-9 rounded border text-sm font-medium transition-colors ${currentPage === page
                          ? "border-accent bg-accent text-white"
                          : "border-slate-300 text-slate-700 hover:border-accent hover:text-accent"
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`rounded border px-4 py-2 text-sm font-medium transition-colors ${currentPage === totalPages
                        ? "cursor-not-allowed border-slate-200 text-slate-400"
                        : "cursor-pointer border-slate-300 text-slate-700 hover:border-accent hover:text-accent"
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