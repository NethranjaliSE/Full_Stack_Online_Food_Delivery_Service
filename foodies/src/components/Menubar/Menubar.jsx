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

  // Get Role to show correct dashboard after login
  const userRole = localStorage.getItem("role");

  const navigate = useNavigate();

  const uniqueItemsInCart = Object.values(quantities || {}).filter(
    (qty) => qty > 0,
  ).length;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Clear role on logout
    localStorage.removeItem("userEmail");
    setToken("");
    setQuantities({});
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top shadow-sm">
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

          <div className="d-flex align-items-center gap-3">
            {/* Cart Icon */}
            <Link to={`/cart`} className="me-2">
              <div className="position-relative">
                <img
                  src={assets.cart_icon || assets.cart}
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

            {!token ? (
              <div className="d-flex align-items-center gap-2">
                {/* 👇 THIS IS THE KEY FIX: Pass state to Register page */}
                <Link
                  to="/register"
                  state={{ role: "ROLE_DELIVERY" }} // Signal to become a Driver
                  className="text-decoration-none text-muted fw-bold me-3 d-none d-md-block"
                  style={{ fontSize: "0.9rem", cursor: "pointer" }}
                >
                  Deliver with us
                </Link>

                <button
                  className="btn btn-outline-primary btn-sm px-3"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="btn btn-primary btn-sm px-3"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </div>
            ) : (
              <div className="dropdown text-end">
                <a
                  href="#"
                  className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={assets.profile_icon || assets.profile}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-circle border"
                  />
                </a>
                <ul
                  className="dropdown-menu text-small shadow"
                  style={{ cursor: "pointer" }}
                >
                  {/* DYNAMIC DASHBOARD LINK: Only show for Delivery Boys */}
                  {userRole === "ROLE_DELIVERY" && (
                    <>
                      <li onClick={() => navigate("/delivery-dashboard")}>
                        <a className="dropdown-item d-flex align-items-center gap-2 text-success fw-bold">
                          <i className="bi bi-bicycle"></i>
                          Delivery Dashboard
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                    </>
                  )}

                  {/* Standard Orders link for Customers */}
                  <li onClick={() => navigate("/myorders")}>
                    <a className="dropdown-item d-flex align-items-center gap-2">
                      <i className="bi bi-bag-check"></i>
                      Orders
                    </a>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

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
