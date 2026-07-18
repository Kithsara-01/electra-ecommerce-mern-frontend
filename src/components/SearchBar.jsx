import { IoClose } from "react-icons/io5";

function SearchBar({ value, onChange, onReset }) {
  return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-2xl px-4 py-3 lg:px-6">
        <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 transition-colors focus-within:border-accent">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search electronic items..."
            value={value}
            onChange={onChange}
            className="flex-1 border-0 bg-transparent px-2 py-1.5 text-sm focus:outline-none placeholder:text-slate-400"
          />

          {/* Clear / Reset */}
          <button
            type="button"
            onClick={onReset}
            disabled={!value}
            className="flex h-9 w-9 items-center justify-center rounded transition-colors disabled:cursor-not-allowed disabled:text-slate-300 enabled:cursor-pointer enabled:text-slate-500 enabled:hover:bg-slate-100 enabled:hover:text-accent"
          >
            <IoClose className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;