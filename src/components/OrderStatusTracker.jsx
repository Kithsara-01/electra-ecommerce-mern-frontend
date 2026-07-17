import {
  FaBoxOpen,
  FaCircleCheck,
  FaCircleXmark,
  FaClipboardCheck,
  FaTruck,
} from "react-icons/fa6";

const STATUS_FLOW = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
];

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

function OrderStatusTracker({
  currentStatus = "Pending",
}) {
  const normalizedStatus = currentStatus.trim();

  const isCancelled =
    normalizedStatus.toLowerCase() === "cancelled";

  const flow = isCancelled
    ? getCancelledFlow(normalizedStatus)
    : STATUS_FLOW;

  const currentIndex = flow.findIndex(
    (step) =>
      step.toLowerCase() ===
      normalizedStatus.toLowerCase()
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

  const getCircleClass = (state, step) => {
    if (state === "completed") {
      return "border-accent bg-accent text-white";
    }

    if (state === "current") {
      if (step === "Cancelled") {
        return "border-red-500 bg-red-500 text-white";
      }

      return "border-accent bg-white text-accent ring-4 ring-accent/15";
    }

    return "border-slate-300 bg-white text-slate-400";
  };

  const getTextClass = (state, step) => {
    if (state === "completed") {
      return "text-accent";
    }

    if (state === "current") {
      if (step === "Cancelled") {
        return "text-red-600";
      }

      return "text-secondary";
    }

    return "text-slate-500";
  };

  const getLineClass = (index) => {
    if (isCancelled) {
      return index < flow.length - 2
        ? "bg-accent"
        : "bg-slate-200";
    }

    return index < currentIndex
      ? "bg-accent"
      : "bg-slate-200";
  };
    return (
    <div className="w-full overflow-x-auto py-2">
      <div className="mx-auto flex min-w-[520px] items-start justify-between">

        {flow.map((step, index) => {
          const state = getStepState(index);
          const Icon = STATUS_ICONS[step] || FaClipboardCheck;
          const isLast = index === flow.length - 1;

          return (
            <div
              key={step}
              className="flex flex-1 items-center"
            >

              {/* Step */}

              <div className="flex flex-col items-center">

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-sm transition-all duration-300 ${getCircleClass(
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
                <div className="flex-1 px-3 pt-7">

                  <div
                    className={`h-[3px] rounded-full transition-all duration-300 ${getLineClass(
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