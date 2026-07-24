import { useEffect, useState } from "react";
import { FaBoxesStacked, FaXmark } from "react-icons/fa6";

function UpdateStockModal({ isOpen, onClose, product, onSave, saving }) {
  const [stock, setStock] = useState(0);

  useEffect(() => {
    if (product) {
      setStock(product.stock || 0);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "Enter") {
        const value = Number(stock);

        if (Number.isFinite(value) && value >= 0) {
          onSave(value);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, stock]);

  if (!isOpen || !product) return null;

  const increase = (value) => {
    setStock((prev) => prev + value);
  };

  const decrease = (value) => {
    setStock((prev) => Math.max(0, prev - value));
  };

  const handleSave = () => {
    const value = Number(stock);

    if (!Number.isFinite(value) || value < 0) {
      return;
    }

    onSave(value);
  };

  // Purely presentational — derived from existing `stock` state on every
  // render, so the preview updates instantly with no new state.
  const currentStock = product.stock || 0;
  const newStockValue = Number.isFinite(Number(stock)) ? Number(stock) : 0;
  const diff = newStockValue - currentStock;

  return (
    <>
      {/* Keyframes for the entrance animation — plain CSS, no new library,
          no extra state. Runs automatically on mount since this component
          only renders while isOpen is true. */}
      <style>{`
        @keyframes stockModalOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes stockModalPopIn {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        style={{ animation: "stockModalOverlayIn 0.18s ease-out" }}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="update-stock-title"
          className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          style={{ animation: "stockModalPopIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <FaBoxesStacked size={18} />
              </span>

              <div>
                <h2 id="update-stock-title" className="text-lg font-semibold text-slate-900">
                  Update Stock
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">{product.name}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="cursor-pointer rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <FaXmark size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-5 px-6 py-6">
            {/* Current stock — highlighted info card */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Current Stock
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {currentStock}
                <span className="ml-1 text-sm font-medium text-slate-400">units</span>
              </p>
            </div>

            {/* New stock input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                New Stock
              </label>

              <input
                autoFocus
                type="number"
                min="0"
                value={stock}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (Number.isNaN(value)) return;
                  if (value < 0) return;
                  setStock(value);
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/10"
              />
            </div>

            {/* Quick adjust buttons */}
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-1.5">
                {[1, 5, 10].map((value) => (
                  <button
                    key={value}
                    onClick={() => increase(value)}
                    className="cursor-pointer rounded-lg border border-transparent bg-white py-2 text-sm font-semibold text-accent shadow-sm transition-colors hover:border-accent hover:bg-accent hover:text-white active:scale-[0.97]"
                  >
                    +{value}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-1.5">
                {[1, 5, 10].map((value) => (
                  <button
                    key={`minus-${value}`}
                    onClick={() => decrease(value)}
                    className="cursor-pointer rounded-lg border border-transparent bg-white py-2 text-sm font-semibold text-rose-600 shadow-sm transition-colors hover:border-rose-300 hover:bg-rose-50 active:scale-[0.97]"
                  >
                    −{value}
                  </button>
                ))}
              </div>
            </div>

            {/* Live preview */}
            <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Current Stock</span>
                <span className="font-medium text-slate-700">{currentStock} units</span>
              </div>

              <div className="mt-1.5 flex items-center justify-between text-sm">
                <span className="text-slate-500">New Stock</span>
                <span className="font-medium text-slate-700">
                  {newStockValue} units
                  {diff !== 0 && (
                    <span className={diff > 0 ? "ml-1.5 text-accent" : "ml-1.5 text-rose-600"}>
                      ({diff > 0 ? "+" : ""}
                      {diff})
                    </span>
                  )}
                </span>
              </div>

              <div className="my-3 border-t border-accent/15" />

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Updated Stock
                </span>
                <span className="text-xl font-bold text-accent">
                  {newStockValue}
                  <span className="ml-1 text-sm font-medium">units</span>
                </span>
              </div>
            </div>

            <p className="-mt-1 text-xs text-slate-400">
              This value will replace the current stock.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-accent hover:text-accent"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving || stock < 0}
              className="cursor-pointer rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateStockModal;