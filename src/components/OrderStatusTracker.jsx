import {
  FaBoxOpen,
  FaCircleCheck,
  FaCircleXmark,
  FaClipboardCheck,
  FaTruck,
} from "react-icons/fa6";

const STATUS_FLOW = ["Pending", "Processing", "Shipped", "Delivered"];
const STATUS_ICONS = {
  Pending: FaClipboardCheck,
  Processing: FaBoxOpen,
  Shipped: FaTruck,
  Delivered: FaCircleCheck,
  Cancelled: FaCircleXmark,
};

const getStatusIndex = (status) => {
  if (!status) return -1;

  const normalized = status.trim().toLowerCase();

  if (normalized === "cancelled") {
    return -2;
  }

  const index = STATUS_FLOW.findIndex((step) => step.toLowerCase() === normalized);
  return index;
};

const getCancelledFlow = (status) => {
  const normalized = (status || "").trim().toLowerCase();

  if (normalized.includes("processing") && normalized.includes("cancel")) {
    return ["Pending", "Processing", "Cancelled"];
  }

  return ["Pending", "Cancelled"];
};

function OrderStatusTracker({ currentStatus = "Pending" }) {
  const normalizedStatus = (currentStatus || "Pending").trim();
  const statusIndex = getStatusIndex(normalizedStatus);
  const isCancelled = normalizedStatus.toLowerCase() === "cancelled" || normalizedStatus.toLowerCase().includes("cancelled");

  const flow = isCancelled ? getCancelledFlow(normalizedStatus) : STATUS_FLOW;

  const getStepState = (stepName, index) => {
    if (isCancelled) {
      if (stepName === "Cancelled") {
        return "current";
      }

      if (index < flow.indexOf("Cancelled")) {
        return "completed";
      }

      return "upcoming";
    }

    if (statusIndex === -1) {
      return index === 0 ? "current" : "upcoming";
    }

    if (index < statusIndex) {
      return "completed";
    }

    if (index === statusIndex) {
      return "current";
    }

    return "upcoming";
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex min-w-[320px] items-center justify-between gap-2 sm:gap-3">
        {flow.map((step, index) => {
          const state = getStepState(step, index);
          const isLast = index === flow.length - 1;
          const isCompleted = state === "completed";
          const isCurrent = state === "current";
          const isUpcoming = state === "upcoming";
          const Icon = STATUS_ICONS[step] || FaClipboardCheck;

          return (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ease-out ${
                    isCompleted
                      ? "border-accent bg-accent text-white shadow-sm"
                      : isCurrent && isCancelled
                        ? "scale-105 border-rose-500 bg-white text-rose-500 shadow-sm"
                        : isCurrent
                          ? "scale-105 border-accent bg-white text-accent shadow-sm"
                          : "border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <span
                  className={`mt-2 text-sm font-semibold transition-colors duration-300 ${
                    isCompleted || (isCurrent && !isCancelled)
                      ? "text-accent"
                      : isCancelled && step === "Cancelled"
                        ? "text-rose-600"
                        : isUpcoming
                          ? "text-slate-500"
                          : "text-accent"
                  }`}
                >
                  {step}
                </span>
              </div>

              {!isLast && (
                <div
                  className={`mx-2 hidden h-0.5 flex-1 rounded-full transition-all duration-300 ease-out sm:block ${
                    index < flow.indexOf("Cancelled") && isCancelled
                      ? "bg-accent"
                      : isCompleted || (isCurrent && !isCancelled)
                        ? "bg-accent"
                        : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderStatusTracker;
