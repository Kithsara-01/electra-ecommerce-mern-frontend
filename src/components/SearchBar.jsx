import { MdOutlineSearch } from "react-icons/md";
import { RiResetLeftFill } from "react-icons/ri";

function SearchBar() {
  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search electronic items..."
            className="flex-1 border border-gray-300 rounded-lg px-5 py-4 focus:outline-none"
          />

          {/* Search Button */}
          <button
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent text-white hover:opacity-85 transition duration-300 cursor-pointer"
          >
            <MdOutlineSearch className="text-2xl" />
          </button>

          {/* Reset Button */}
          <button
            className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:border-accent hover:text-accent hover:bg-gray-50 transition duration-300 cursor-pointer"
          >
            <RiResetLeftFill className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;