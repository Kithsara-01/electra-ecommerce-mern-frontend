import { FaStar } from "react-icons/fa";

function StarRating({
  rating = 0,
  onChange,
  size = 22,
  readOnly = false,
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange(star)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className={
            readOnly
              ? "cursor-default"
              : "cursor-pointer transition-opacity hover:opacity-70"
          }
        >
          <FaStar
            size={size}
            className={
              star <= rating ? "text-amber-400" : "text-slate-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default StarRating;