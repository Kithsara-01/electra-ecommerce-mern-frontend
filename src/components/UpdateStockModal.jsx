import { useEffect, useState } from "react";

function UpdateStockModal({
  isOpen,
  onClose,
  product,
  onSave,
  saving,
}) {
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

  return (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        onClick={onClose}
        >

      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
        >

        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-xl font-semibold text-secondary">
            Update Stock
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {product.name}
          </p>

        </div>

        {/* Body */}
        <div className="space-y-6 p-6">

          <div>

            <p className="text-sm text-slate-500">
              Current Stock
            </p>

            <h3 className="mt-1 text-3xl font-bold text-accent">
              {product.stock}
            </h3>

          </div>

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

              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-accent"
            />

          </div>

          <div className="grid grid-cols-3 gap-2">

            {[1, 5, 10].map((value) => (
              <button
                key={value}
                onClick={() => increase(value)}
                className="rounded-lg border border-emerald-300 bg-emerald-50 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
              >
                +{value}
              </button>
            ))}

            {[1, 5, 10].map((value) => (
              <button
                key={`minus-${value}`}
                onClick={() => decrease(value)}
                className="rounded-lg border border-rose-300 bg-rose-50 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
              >
                -{value}
              </button>
            ))}

          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">

          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving || stock < 0}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default UpdateStockModal;