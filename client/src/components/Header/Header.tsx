import SearchField from "../SearchField/SearchField";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-wrapper">
        <h1 className="header-title">Local Travel & Weather Hub</h1>
        <SearchField />
      </div>
    </header>
  );
};

export default Header;
