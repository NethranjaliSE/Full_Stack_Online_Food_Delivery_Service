import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="container py-5">
        <div className="row">
          {/* Tracking Links */}
          <div className="col-md-3 mb-4">
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/track">Order Tracking</Link>
              </li>
              <li>
                <Link to="/coverage">Delivery Coverage</Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div className="col-md-3 mb-4">
            <h5 className="footer-title">About</h5>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Use</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-md-3 mb-4">
            <h5 className="footer-title">Contact Us</h5>
            <div className="contact-item">
              <i className="bi bi-geo-alt"></i>
              <span>48, Foodie Avenue, Colombo 01, Sri Lanka</span>
            </div>
            <div className="contact-item mt-2">
              <i className="bi bi-telephone"></i>
              <span>+94 741 052 034</span>
            </div>
            <div className="contact-item mt-2">
              <i className="bi bi-envelope"></i>
              <span>support@foodiefleet.com</span>
            </div>
            <div className="social-icons mt-3">
              <i className="bi bi-instagram"></i>
              <i className="bi bi-facebook mx-2"></i>
              <i className="bi bi-linkedin"></i>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="col-md-3 mb-4">
            <h5 className="footer-title">Subscribe Now</h5>
            <p className="small text-muted">
              Send us your email address to find out about our exciting offers.
            </p>
            <input
              type="email"
              className="form-control mb-2 footer-input"
              placeholder="Email Address"
            />
            <button className="btn subscribe-btn w-100">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom py-3">
        <div className="container d-flex justify-content-between small">
          <span>© Foodie Fleet, All Rights Reserved.</span>
          <span>Design & Concept by HBSI.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
