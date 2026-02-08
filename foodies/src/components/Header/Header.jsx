import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <div className="p-5 mb-4 bg-light rounded-3 mt-1 header">
      <div className="container-fluid py-5">
        {/* --- NEW: Contact & Delivery Info Section --- */}
        <div className="d-flex flex-wrap gap-4 mb-4 text-white-50">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-telephone-fill text-warning"></i>
            <span className="fw-bold text-white">+94 741 052 034</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-clock-fill text-warning"></i>
            <span className="fw-bold text-white">
              Daily: 10.00 AM - 10.00 PM
            </span>
          </div>
        </div>
        {/* -------------------------------------------- */}

        <h1 className="display-5 fw-bold text-white">
         Hey  Foodie Fleet 
        </h1>
        <p className="col-md-8 fs-4 text-white">
          Fast,Fresh,Delivered to your Door
        </p>
        <Link
          to="/explore"
          className="btn btn-light text-primary fw-bold rounded-pill px-4 mt-2"
        >
          Explore Menu
        </Link>
      </div>
    </div>
  );
};

export default Header;
