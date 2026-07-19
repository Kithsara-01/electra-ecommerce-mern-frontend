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

function ReviewCard({
  review,
  currentUser,
  onEdit,
  onDelete,
}) {
  const isOwner =
    currentUser && review.customer?._id === currentUser._id;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                {(review.customer?.name || "A").charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-800">
                  {review.customer?.name || "Anonymous"}
                </h3>

                <p className="text-sm text-slate-500">
                  {formatReviewDate(review.createdAt)}
                </p>
              </div>
            </div>
        </div>

        <StarRating
            rating={review.rating}
            readOnly
            size={18}
          />
      </div>

      <p className="mt-5 leading-7 text-slate-600">
        {review.comment}
      </p>

      {isOwner && (
        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={() => onEdit(review)}
            className="rounded-md border border-accent px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent hover:text-white"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(review._id)}
            className="rounded-md border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewCard;