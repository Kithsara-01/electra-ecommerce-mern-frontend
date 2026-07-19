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
          className={`transition-transform ${
            readOnly
              ? "cursor-default"
              : "cursor-pointer hover:scale-110"
          }`}
        >
          <FaStar
            size={size}
            className={
              star <= rating
                ? "text-yellow-400"
                : "text-slate-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default StarRating;