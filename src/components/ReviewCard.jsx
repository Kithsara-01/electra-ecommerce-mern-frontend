import StarRating from "./StarRating";

const formatReviewDate = (date) => {
  const now = new Date();
  const reviewDate = new Date(date);

  const diffTime = now - reviewDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week(s) ago`;

  return reviewDate.toLocaleDateString();
};

const getInitials = (name) => {
  if (!name) return "A";

  const parts = name.trim().split(/\s+/);
  const initials =
    parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : parts[0].slice(0, 2);

  return initials.toUpperCase();
};

function ReviewCard({ review, currentUser, onEdit, onDelete }) {
  const isOwner = currentUser && review.customer?._id === currentUser._id;

  const wasEdited =
    review.updatedAt &&
    new Date(review.updatedAt).getTime() - new Date(review.createdAt).getTime() > 60000;

  return (
    <div className="rounded border border-slate-300 bg-white p-5 transition-colors hover:border-accent">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
            {getInitials(review.customer?.name)}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">
                {review.customer?.name || "Anonymous"}
              </h3>

              {review.verifiedPurchase && (
                <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                  Verified Purchase
                </span>
              )}
            </div>

            <p className="text-sm text-slate-500">
              {formatReviewDate(review.createdAt)}
              {wasEdited && <span className="text-slate-400"> · Edited</span>}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <StarRating rating={review.rating} readOnly size={18} />
          <span className="text-sm font-medium text-slate-600">
            {review.rating?.toFixed(1)}
          </span>
        </div>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
        {review.comment}
      </p>

      {isOwner && (
        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
          <button
            onClick={() => onEdit(review)}
            className="cursor-pointer rounded-md border border-accent px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(review._id)}
            className="cursor-pointer rounded-md border border-rose-300 px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewCard;