import { MdOutlineSearch } from "react-icons/md";
import { RiResetLeftFill } from "react-icons/ri";

function SearchBar({ value, onChange, onReset }) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-2 shadow-sm">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search electronic items..."
            value={value}
            onChange={onChange}
            className="flex-1 border-0 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400"
          />

          {/* Search Button */}
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2FA084] text-white transition hover:opacity-90">
            <MdOutlineSearch className="text-xl" />
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#2FA084] hover:text-[#2FA084]">
            <RiResetLeftFill className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;