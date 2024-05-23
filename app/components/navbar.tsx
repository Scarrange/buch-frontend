// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import Login from "./login";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (event.clientY < 125) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light bg-white ${showNavbar ? "show" : ""}`}
    >
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
            <Link
              to="/new"
              style={{ color: "white", textDecoration: "none" }}
            >
              <button type="button" className="btn btn-primary btn-lg me-2">
                Buch anlegen
              </button>
            </Link>
            <Login />
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
