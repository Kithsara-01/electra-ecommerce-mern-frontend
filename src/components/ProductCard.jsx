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
      className="group cursor-pointer select-none overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-40 overflow-hidden bg-slate-100">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={product?.name || "Product"}
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-500">
            No Image Available
          </div>
        )}
      </div>

      <div className="space-y-3 p-3">
        <div className="space-y-1.5">
          <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
            {product?.name || "Product Name"}
          </h3>

          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">Brand:</span>{" "}
            {product?.brand || "N/A"}
          </p>

          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">Model:</span>{" "}
            {product?.model || "N/A"}
          </p>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-sm text-slate-400 line-through">
              {formatPrice(labelPrice)}
            </p>

            <p className="text-xl font-bold text-slate-900">
              {formatPrice(sellingPrice)}
            </p>
          </div>

          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              isInStock
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {isInStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;