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

const getCancelledFlow = (status) => {
  const normalized = (status || "").toLowerCase();

  if (normalized.includes("processing")) {
    return ["Pending", "Processing", "Cancelled"];
  }

  return ["Pending", "Cancelled"];
};

function OrderStatusTracker({ currentStatus = "Pending" }) {
  const normalizedStatus = currentStatus.trim();

  const isCancelled = normalizedStatus.toLowerCase() === "cancelled";

  const flow = isCancelled ? getCancelledFlow(normalizedStatus) : STATUS_FLOW;

  const currentIndex = flow.findIndex(
    (step) => step.toLowerCase() === normalizedStatus.toLowerCase()
  );

  const getStepState = (index) => {
    if (isCancelled) {
      if (index < flow.length - 1) return "completed";
      return "current";
    }

    if (index < currentIndex) return "completed";

    if (index === currentIndex) return "current";

    return "upcoming";
  };

  // Icon box styling — kept consistent with the rounded-md square icon
  // treatment used for card headers elsewhere in the app.
  const getBoxClass = (state, step) => {
    if (state === "completed") {
      return "border-accent bg-accent text-white";
    }

    if (state === "current") {
      if (step === "Cancelled") {
        return "border-rose-600 bg-rose-600 text-white";
      }

      return "border-accent bg-accent/10 text-accent ring-4 ring-accent/10";
    }

    return "border-slate-300 bg-white text-slate-400";
  };

  const getTextClass = (state, step) => {
    if (state === "completed") {
      return "text-accent";
    }

    if (state === "current") {
      if (step === "Cancelled") {
        return "text-rose-700";
      }

      return "text-slate-900";
    }

    return "text-slate-500";
  };

  const getLineClass = (index) => {
    if (isCancelled) {
      return index < flow.length - 2 ? "bg-accent" : "bg-slate-200";
    }

    return index < currentIndex ? "bg-accent" : "bg-slate-200";
  };

  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="mx-auto flex min-w-[520px] items-start justify-between">
        {flow.map((step, index) => {
          const state = getStepState(index);
          const Icon = STATUS_ICONS[step] || FaClipboardCheck;
          const isLast = index === flow.length - 1;

          return (
            <div key={step} className="flex flex-1 items-center">
              {/* Step */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-md border transition-colors duration-300 ${getBoxClass(
                    state,
                    step
                  )}`}
                >
                  <Icon className="text-lg" />
                </div>

                <p
                  className={`mt-3 text-sm font-semibold ${getTextClass(
                    state,
                    step
                  )}`}
                >
                  {step}
                </p>
              </div>

              {/* Connector */}
              {!isLast && (
                <div className="flex-1 px-3 pt-6">
                  <div
                    className={`h-[3px] rounded transition-colors duration-300 ${getLineClass(
                      index
                    )}`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderStatusTracker;