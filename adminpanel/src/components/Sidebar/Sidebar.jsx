import React from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";

const Sidebar = ({ sidebarVisible }) => {
  const location = useLocation();

  // Helper function to set active class based on current path
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <div
      className={`border-end bg-white ${sidebarVisible ? "" : "d-none"}`}
      id="sidebar-wrapper"
      style={{ minHeight: "100vh" }} // Ensure full height
    >
      <div className="sidebar-heading border-bottom bg-light py-4 px-3">
        <img src={assets.logo} alt="Foodies Logo" height={32} />
        <span className="ms-2 fw-bold text-primary">Admin Panel</span>
      </div>

      <div className="list-group list-group-flush">
        <Link
          className={`list-group-item list-group-item-action list-group-item-light p-3 ${isActive("/add")}`}
          to="/add"
        >
          <i className="bi bi-plus-circle me-2"></i> Add Food
        </Link>

        <Link
          className={`list-group-item list-group-item-action list-group-item-light p-3 ${isActive("/list")}`}
          to="/list"
        >
          <i className="bi bi-list-ul me-2"></i> List Food
        </Link>

        <Link
          className={`list-group-item list-group-item-action list-group-item-light p-3 ${isActive("/orders")}`}
          to="/orders"
        >
          <i className="bi bi-cart me-2"></i> Orders
        </Link>

        {/* UPDATED: Matches the route in App.jsx */}
        <Link
          className={`list-group-item list-group-item-action list-group-item-light p-3 ${isActive("/delivery-list")}`}
          to="/delivery-list"
        >
          <i className="bi bi-truck me-2"></i> Delivery Team
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
