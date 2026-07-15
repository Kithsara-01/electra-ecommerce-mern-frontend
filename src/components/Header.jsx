import Navibar from "./Navibar";
import SearchBar from "./SearchBar";


function Header({ showSearch = true }) {
  return (
    <header>
      <Navibar />
      {showSearch && <SearchBar />}
    </header>
  );
}
export default Header;