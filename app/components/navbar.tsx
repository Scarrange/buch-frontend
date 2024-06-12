import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import Login from "./login";
import Logout from "./logout";

const Navbar = (props: { isLoggedIn: boolean }) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [isFixed, setIsFixed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 950);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 950);
    };
    handleResize(); // Initiales Setup

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsFixed(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      if (isFixed) {
        document.body.classList.add(
          "navbar-fixed-padding",
          "navbar-hovered-padding",
        );
      } else {
        document.body.classList.remove("navbar-fixed-padding");
      }
      if (isFixed) return;

      const handleMouseMove = (event: MouseEvent) => {
        if (event.clientY < 125) {
          setShowNavbar(true);
          document.body.classList.add("navbar-hovered-padding");
        } else {
          setShowNavbar(false);
          document.body.classList.remove("navbar-hovered-padding");
          document.body.classList.remove("navbar-fixed-padding");
        }
      };
    }
  }, [isFixed, isMobile]);

  const toggleFixed = () => {
    if (!isMobile) {
      setIsFixed(!isFixed);
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const navbarStyle = {
    backgroundColor: "white",
    position: isFixed ? "fixed" : "relative",
    top: 0,
    width: "100%",
    zIndex: 1000,
    transition: "top 0.3s",
    top: showNavbar ? 0 : "-60px",
  };

  const logoStyle = {
    width: isMobile ? "100px" : "150px",
    height: "auto",
    transition: "width 0.3s, height 0.3s",
  };

  const buttonStyle = {
    fontSize: isMobile ? "0.875rem" : "1rem",
    padding: isMobile ? "0.5rem 0.75rem" : "0.75rem 1.25rem",
  };

  const hamburgerMenuStyle = {
    display: showMobileMenu ? "block" : "none",
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "white",
    zIndex: 2000,
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  };

  useEffect(() => {
    if (!isFixed && !isMobile) {
      const handleMouseMove = (event: MouseEvent) => {
        if (event.clientY < 60) {
          setShowNavbar(true);
        } else {
          setShowNavbar(false);
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isFixed, isMobile]);

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light bg-white ${showNavbar || isMobile ? "show" : ""}`}
      style={navbarStyle}
    >
      <div className="container-fluid navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-brand">
            <img
              src="images/hochschule.png"
              alt="Hochschule"
              style={logoStyle}
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
            <div style={hamburgerMenuStyle} className="hamburger-menu mb-5">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/" className="nav-link" onClick={toggleMobileMenu}>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/search"
                    className="nav-link"
                    onClick={toggleMobileMenu}
                  >
                    Buch suchen
                  </Link>
                </li>
                {props.isLoggedIn && (
                  <li className="nav-item">
                    <Link
                      to="/new"
                      className="nav-link"
                      onClick={toggleMobileMenu}
                    >
                      Buch anlegen
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  {props.isLoggedIn ? (
                    <Logout onClick={toggleMobileMenu} />
                  ) : (
                    <Link
                      to="/login"
                      className="nav-link"
                      onClick={toggleMobileMenu}
                    >
                      Login
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="navbar-buttons">
            <div className="d-flex ms-5">
              <Link
                to="/search"
                style={{ color: "white", textDecoration: "none" }}
              >
                <button
                  type="button"
                  className="btn btn-primary btn-lg me-2"
                  style={buttonStyle}
                >
                  Buch suchen
                </button>
              </Link>
              {props.isLoggedIn && (
                <Link
                  to="/new"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <button
                    type="button"
                    className="btn btn-primary btn-lg me-2"
                    style={buttonStyle}
                  >
                    Buch anlegen
                  </button>
                </Link>
              )}
              {props.isLoggedIn ? <Logout /> : <Login />}
            </div>
          </div>
        )}

        <div className="ms-auto">
          {!isMobile && (
            <button
              onClick={toggleFixed}
              className="btn btn-primary btn-lg me-2"
              style={buttonStyle}
            >
              {isFixed ? "Unfix Navbar" : "Fix Navbar"}
            </button>
          )}
        </div>
        <div className="navbar-brand">
          <Link to="/" className="navbar-brand">
            <img
              src="images/hkaquer.png"
              alt="Hochschule"
              style={logoStyle}
              className="navbar-image"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
