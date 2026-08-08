import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  const navigate = useNavigate();

  const imageUrl = product?.images?.[0] || "";
  const isInStock = product?.stock > 0;
  const labelPrice = product?.labelledPrice ?? 0;
  const sellingPrice = product?.price ?? 0;

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  return (
    <div
      onClick={() => navigate(`/products/${product?.productId}`)}
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition-colors hover:border-accent"
    >
      {/* Product Image */}
      <div className="flex h-64 items-center justify-center">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={product?.name || "Product"}
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-full w-full object-contain p-3"
          />
        ) : (
          <div className="text-sm text-slate-400">
            No Image Available
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col border-t border-slate-100 px-3 py-3">
        {/* Brand */}
        <p className="text-xs text-slate-500">
          {product?.brand || "N/A"}
        </p>

        {/* Product Name */}
        <h3 className="mt-0.5 min-h-[40px] line-clamp-2 text-sm font-medium text-slate-900">
          {product?.name || "Product Name"}
        </h3>

        {/* Price & Stock */}
        <div className="mt-2 flex items-center justify-between">
          <div>
            {/* Original Price */}
            {labelPrice > sellingPrice && (
              <p className="text-xs text-slate-400 line-through">
                {formatPrice(labelPrice)}
              </p>
            )}

            {/* Selling Price */}
            <p className="text-base font-semibold text-secondary">
              {formatPrice(sellingPrice)}
            </p>
          </div>

          {/* Stock Status */}
          <span
            className={`rounded px-2 py-0.5 text-[11px] font-medium ${
              isInStock
                ? "bg-accent/10 text-accent"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {isInStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* View Details Button */}
        <button
          className="mt-auto w-full rounded border border-accent py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products/${product?.productId}`);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;