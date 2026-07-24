import { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  getWishlist, removeFromWishlist,} from "../services/wishlistService";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

function Wishlist() {

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
  fetchWishlist();
}, []);

const fetchWishlist = async () => {
  try {
    setLoading(true);

    const response = await getWishlist();

    setWishlist(response.wishlist);
  } catch (error) {
    setError(
      error.response?.data?.message || "Failed to load wishlist"
    );
  } finally {
    setLoading(false);
  }
};


const handleRemove = async (productId) => {
  try {
    const response = await removeFromWishlist(productId);

    toast.success(response.message);

    setWishlist((prev) =>
      prev.filter((item) => item.product._id !== productId)
    );
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to remove product from wishlist"
    );
  }
};

if (loading) {
    return (
      <>
        <Header />

        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-accent"></div>

            <p className="text-sm text-slate-600">
              Loading wishlist...
            </p>
          </div>
        </div>
      </>
    );
  }


  return (
    <>
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">
          My Wishlist
        </h1>

        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center">
            {error ? (
            <p className="text-red-600">{error}</p>
            ) : wishlist.length === 0 ? (
            <p className="text-slate-600">Your wishlist is empty.</p>
            ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {wishlist.map((item) => (
                <div
                    key={item._id}
                    className="rounded-lg border border-slate-200 bg-white p-4"
                >
                    <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className="h-52 w-full rounded object-contain"
                    />

                    <h2 className="mt-4 text-lg font-semibold">
                    {item.product.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                    {item.product.category}
                    </p>

                    <p className="mt-3 text-xl font-bold text-accent">
                    LKR {item.product.price.toLocaleString()}
                    </p>

                    <div className="mt-5 flex gap-3">
                    <Link
                        to={`/products/${item.product.productId}`}
                        className="flex-1 rounded border border-accent px-4 py-2 text-center font-medium text-accent transition hover:bg-accent hover:text-white"
                    >
                        View Details
                    </Link>

                    <button
                        onClick={() => handleRemove(item.product._id)}
                        className="rounded bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
                    >
                        Remove
                    </button>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
      </div>
    </>
  );
}

export default Wishlist;