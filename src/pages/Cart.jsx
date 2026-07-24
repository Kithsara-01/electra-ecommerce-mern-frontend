import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Header from "../components/Header";
import { getCart, updateCartItem, removeCartItem } from "../services/cartService";

function Cart() {

  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
        }
      setError("");
      const response = await getCart();
      setCartItems(response.cart.items || []);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to load cart";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      if (showLoading) {
        setLoading(false);
        }
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(price || 0);

  const handleQuantityChange = async (itemId, currentQuantity, newQuantity) => {
    // Prevent quantity below 1
    if (newQuantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    // Prevent unnecessary updates
    if (newQuantity === currentQuantity) {
      return;
    }

    try {
      setUpdatingItemId(itemId);
      const response = await updateCartItem({
        productId: itemId,
        quantity: newQuantity,
      });

      // Reload cart with updated data
      await fetchCart(false);

      // No success toast for quantity updates
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update quantity"
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setRemovingItemId(itemId);

      const response = await removeCartItem(itemId);

      await fetchCart(false);

      toast.success(response.message || "Item removed from cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove item from cart"
      );
    } finally {
      setRemovingItemId(null);
    }
  };

  const calculateSubtotal = (price, quantity) => price * quantity;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = cartItems.reduce(
    (sum, item) => sum + calculateSubtotal(item.productId.price, item.quantity),
    0
  );

  if (loading) {
    return (
      <>
        <Header showSearch={false} />

        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-accent"></div>

            <p className="text-sm text-slate-600">
              Loading cart...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header showSearch={false} />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-red-600">
          {error}
        </div>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Header showSearch={false} />
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="rounded-md border border-slate-200 bg-white p-8 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-slate-600">
              Add some products to get started!
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-6 cursor-pointer rounded border border-accent bg-white px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
            >
              Browse Products
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header showSearch={false} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Shopping Cart
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Review Your Cart
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Review your selected products before proceeding to checkout.
            </p>

          </div>

          <div className="rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
            {totalItems} {totalItems === 1 ? "Item" : "Items"}
          </div>

        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => {
                const subtotal = calculateSubtotal(item.productId.price, item.quantity);
                const productImage = item.productId.images?.[0] || "";

                return (
                  <div
                    key={item.productId._id}
                    className="flex flex-col gap-5 rounded-md border border-slate-200 bg-white p-5 transition-colors hover:border-accent sm:flex-row sm:items-center"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded bg-white sm:h-32 sm:w-32">
                        <img
                          src={productImage}
                          alt={item.productId.name}
                          className="h-full w-full object-contain p-1"
                        />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="min-w-0 flex-1">

                      <h3 className="truncate text-base font-semibold text-slate-900">
                        {item.productId.name}
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {item.productId.brand || "Electra"}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-6">

                        {/* Unit Price */}
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Unit Price
                          </p>

                          <p className="font-semibold text-slate-900">
                            {formatPrice(item.productId.price)}
                          </p>
                        </div>

                        {/* Quantity */}
                        <div>

                          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
                            Quantity
                          </p>

                          <div className="flex items-center rounded border border-slate-200">

                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId._id,
                                  item.quantity,
                                  item.quantity - 1
                                )
                              }
                              disabled={
                                updatingItemId === item.productId._id ||
                                item.quantity === 1
                              }
                              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-l text-slate-600 transition-colors hover:bg-slate-100 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-600"
                              title="Decrease quantity"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>

                            <span className="w-10 text-center text-sm font-semibold text-slate-900">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId._id,
                                  item.quantity,
                                  item.quantity + 1
                                )
                              }
                              disabled={updatingItemId === item.productId._id}
                              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-r text-slate-600 transition-colors hover:bg-slate-100 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-600"
                              title="Increase quantity"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>

                          </div>

                        </div>

                        {/* Subtotal */}
                        <div>

                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Subtotal
                          </p>

                          <p className="text-lg font-bold text-slate-900">
                            {formatPrice(subtotal)}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* Remove */}
                    <div className="flex flex-shrink-0 items-start justify-end">
                      <button
                        onClick={() => handleRemoveItem(item.productId._id)}
                        disabled={removingItemId === item.productId._id}
                        className="flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Remove Item"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Summary Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-md border border-slate-200 bg-white p-6">

              <h2 className="text-sm font-semibold text-slate-900">
                Order Summary
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Review your order before checkout.
              </p>

              <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Total Items
                  </span>

                  <span className="font-semibold text-slate-900">
                    {totalItems}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Delivery Fee
                  </span>

                  <span className="font-medium text-slate-500">
                    Calculated at Checkout
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Discount
                  </span>

                  <span className="font-medium text-slate-500">
                    LKR 0
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-5">

                  <div className="flex items-center justify-between">

                    <span className="text-base font-semibold text-slate-900">
                      Grand Total
                    </span>

                    <span className="text-2xl font-bold text-accent">
                      {formatPrice(grandTotal)}
                    </span>

                  </div>

                </div>

              </div>

              <Link
                to="/checkout"
                className="mt-7 block w-full cursor-pointer rounded bg-accent px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-secondary"
              >
                Proceed to Checkout
              </Link>

              <button
                onClick={() => navigate("/products")}
                className="mt-3 w-full cursor-pointer rounded border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition-colors hover:border-accent hover:text-accent"
              >
                Continue Shopping
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;