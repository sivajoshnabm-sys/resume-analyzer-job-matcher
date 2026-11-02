interface NavbarProps {
  setPage: (
    page: "home" | "analyzer" | "results"
  ) => void;
}

function Navbar({ setPage }: NavbarProps) {
  return (
    <nav className="navbar">

      <div
        className="logo"
        onClick={() => setPage("home")}
      >
        Resume Matcher
      </div>

      <div className="nav-links">

        <button
          onClick={() => setPage("home")}
        >
          Home
        </button>

        <button
          onClick={() => setPage("analyzer")}
        >
          Analyzer
        </button>

      </div>

    </nav>
  );
}

export default Navbar;