import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { Login } from "./login";
import { Logout } from "./logout";
import classNames from "classnames";
import hkaQuer from "images/HKAQuer.png";
import hochschule from "images/Hochschule.png";

export const Navbar = (props: { isLoggedIn: boolean }) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [isFixed, setIsFixed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleFixed = () => {
    if (!isMobile) {
      setIsFixed(!isFixed);
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 950);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsFixed(true);
      document.body.classList.add("navbar-fixed-padding");
      return;
    }
    if (isFixed) {
      document.body.classList.add(
        "navbar-fixed-padding",
        "navbar-hovered-padding",
      );
      setShowNavbar(true);
      return;
    } else {
      document.body.classList.remove("navbar-fixed-padding");
    }

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

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isFixed, isMobile]);

  useEffect(() => {
    if (showNavbar || isFixed) {
      document
        .getElementById("searchForm")
        ?.classList.remove("sticky-form-stuck");
    } else {
      document.getElementById("searchForm")?.classList.add("sticky-form-stuck");
    }
  }, [showNavbar, isFixed]);

  return (
    <nav
      className={classNames(
        "navbar",
        "shadow",
        "navbar-expand-lg",
        "navbar-light",
        "bg-white",
        { show: showNavbar || isMobile },
      )}
    >
      <div className="navbar-buttons container-fluid navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-brand">
            <img
              src={hochschule}
              alt="Hochschule"
              className="navbar-image logo-style"
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
            <div
              className="hamburger-menu show mb-5"
              style={{ display: showMobileMenu ? "block" : "none" }}
            >
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
                <button type="button" className="btn btn-primary btn-lg me-2">
                  Buch suchen
                </button>
              </Link>
              {props.isLoggedIn && (
                <Link
                  to="/new"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <button type="button" className="btn btn-primary btn-lg me-2">
                    Buch anlegen
                  </button>
                </Link>
              )}
              {props.isLoggedIn ? <Logout /> : <Login />}
            </div>
          </div>
        )}

        <div className="ms-auto h-100">
          {isMobile || (
            <button
              onClick={toggleFixed}
              className="btn btn-primary btn-lg me-2"
            >
              {isFixed ? "Lösen" : "Fixieren"}
            </button>
          )}
        </div>
        <div className="navbar-brand">
          <Link to="/" className="navbar-brand">
            <img
              src={hkaQuer}
              alt="HKA Logo"
              className="navbar-image logo-style"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};
