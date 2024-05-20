import { Link } from "@remix-run/react";
import Login from "./login";
//import Logout from "./logout";
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white">
      <div className="container-fluid navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-brand">
            <img
              src="images/hochschule.png"
              alt="Hochschule"
              className="navbar-image"
            />
          </Link>
        </div>

        <div className="navbar-buttons">
          <div className="d-flex ms-5">
            <Link
              to="/search"
              style={{ color: "white", textDecoration: "none" }}
            >
              <button type="button" className="btn btn-primary btn-lg me-2">
                Buch suchen
              </button>
            </Link>
            <Link to="/new" style={{ color: "white", textDecoration: "none" }}>
              <button type="button" className="btn btn-primary btn-lg">
                Buch anlegen
              </button>
            </Link>
          </div>
          <div className="login-container">
            <Login />
            {/* TODO loggedIn ? Login : Logout */}
          </div>
        </div>
        <div className="navbar-brand">
          <Link to="/" className="navbar-brand">
            <img
              src="images/hkaquer.png"
              alt="Hochschule"
              className="navbar-image"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
