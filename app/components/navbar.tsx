// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import Login from "./login";
import Logout from "./logout";
import "./styles.css"; // Import the CSS with styles

const Navbar = (props: { isLoggedIn: boolean }) => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 950);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 950);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsFixed(true);
      return;
    }

    if (isFixed) {
      document.body.classList.add("navbar-fixed-padding");
    } else {
      document.body.classList.remove("navbar-fixed-padding");
    }

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
  }, [isFixed, isMobile]);

  const toggleFixed = () => {
    setIsFixed(!isFixed);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light bg-white ${showNavbar || isMobile ? "show" : ""}`}
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
        
        {isMobile ? (
          <>
            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleMobileMenu}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            {showMobileMenu && (
              <div className="hamburger-menu show">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link to="/search" className="nav-link" onClick={toggleMobileMenu}>
                      Buch suchen
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/new" className="nav-link" onClick={toggleMobileMenu}>
                      Buch anlegen
                    </Link>
                  </li>
                  <li className="nav-item">
                    {props.isLoggedIn ? (
                      <Logout />
                    ) : (
                      <Link to="/login" className="nav-link" onClick={toggleMobileMenu}>
                        Login
                      </Link>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
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
              {props.isLoggedIn ? <Logout /> : <Login />}
            </div>
          </div>
        )}
        
        <div className="ms-auto">
          {!isMobile && (
            <button onClick={toggleFixed} className="btn btn-primary btn-lg me-2">
              {isFixed ? "Unfix Navbar" : "Fix Navbar"}
            </button>
          )}
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
