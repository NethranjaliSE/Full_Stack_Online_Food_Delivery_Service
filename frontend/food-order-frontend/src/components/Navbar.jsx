import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <Link to="/">FoodieExpress</Link>
      </div>
      <nav className="navbar__links">
        <Link to="/menu">Menu</Link>
        <Link to="/cart">Cart</Link>
        {user ? (
          <>
            <span className="navbar__user">Hi, {user.name}</span>
            <button className="navbar__btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="navbar__btn">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
