import { Link } from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import Login from "./login";
import Logout from "./logout";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-red">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <FontAwesomeIcon icon={faHouse} style={{ color: "white" }} />
        </Link>
        <div className="d-flex ms-5">
          <Link to="/search" style={{ color: "white", textDecoration: "none" }}>
            <button type="button" className="btn btn-primary me-2">
              Buch suchen
            </button>
          </Link>
          <Link to="/new" style={{ color: "white", textDecoration: "none" }}>
            <button type="button" className="btn btn-primary">
              Buch anlegen
            </button>
          </Link>
        </div>
        <div className="ms-auto">
          <Login />
          {/* TODO loggedIn ? Login : Logout */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
