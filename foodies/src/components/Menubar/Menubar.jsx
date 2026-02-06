import React, { useContext, useState } from "react";
import "./Menubar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Menubar = () => {
  const [active, setActive] = useState("home");

  // 1. Get Context Data
  const { quantities, token, setToken, setQuantities } =
    useContext(StoreContext);

  const navigate = useNavigate();

  // 2. CRITICAL FIX: Add '|| {}' to prevent crash if quantities is null
  const uniqueItemsInCart = Object.values(quantities || {}).filter(
    (qty) => qty > 0,
  ).length;

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setQuantities({}); // Reset cart on logout
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <Link to="/">
          <img
            src={assets.logo}
            alt="Logo"
            className="mx-4"
            height={48}
            width={48}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={
                  active === "home" ? "nav-link fw-bold active" : "nav-link"
                }
                to="/"
                onClick={() => setActive("home")}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  active === "explore" ? "nav-link fw-bold active" : "nav-link"
                }
                to="/explore"
                onClick={() => setActive("explore")}
              >
                Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  active === "contact-us"
                    ? "nav-link fw-bold active"
                    : "nav-link"
                }
                to="/contact"
                onClick={() => setActive("contact-us")}
              >
                Contact us
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-4">
            {/* Cart Icon */}
            <Link to={`/cart`}>
              <div className="position-relative">
                <img
                  src={assets.cart_icon || assets.cart} // Ensure this matches your assets file name
                  alt="Cart"
                  height={28}
                  width={28}
                  className="position-relative"
                />
                {uniqueItemsInCart > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                    {uniqueItemsInCart}
                  </span>
                )}
              </div>
            </Link>

            {/* Login/Register or Profile Dropdown */}
            {!token ? (
              <>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </>
            ) : (
              <div className="dropdown text-end">
                <a
                  href="#"
                  className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={assets.profile_icon || assets.profile} // Ensure matches assets file
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-circle"
                  />
                </a>
                <ul
                  className="dropdown-menu text-small"
                  style={{ cursor: "pointer" }}
                >
                  {/* ORDERS BUTTON */}
                  <li onClick={() => navigate("/myorders")}>
                    <a className="dropdown-item d-flex align-items-center gap-2">
                      <i className="bi bi-bag-check"></i>
                      Orders
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  {/* LOGOUT BUTTON */}
                  <li onClick={logout}>
                    <a className="dropdown-item d-flex align-items-center gap-2 text-danger">
                      <i className="bi bi-box-arrow-right"></i>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
