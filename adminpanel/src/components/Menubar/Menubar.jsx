import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Menubar = ({ toggleSidebar, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear the state in App.jsx to trigger the Login view
    setToken("");

    // 2. Clear local storage to prevent auto-login on refresh
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // 3. Provide feedback and redirect
    toast.info("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid">
        {/* Sidebar Toggle Button */}
        <button
          className="btn btn-primary"
          id="sidebarToggle"
          onClick={toggleSidebar}
        >
          <i className="bi bi-list"></i>
        </button>

        {/* NEW: Logout Button */}
        <div className="ms-auto">
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
