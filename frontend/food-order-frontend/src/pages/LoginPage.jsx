import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const EyeIcon = ({ open }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
       xmlns="http://www.w3.org/2000/svg">
    {open ? (
      <>
        <path
          d="M2 12C3.8 7.9 7.5 5 12 5C16.5 5 20.2 7.9 22 12C20.2 16.1 16.5 19 12 19C7.5 19 3.8 16.1 2 12Z"
          stroke="#666" strokeWidth="1.7" strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="#666" strokeWidth="1.7" />
      </>
    ) : (
      <>
        <path d="M3 3L21 21" stroke="#666" strokeWidth="1.7"
              strokeLinecap="round" />
        <path
          d="M4.5 5.1C3.1 6.3 2 8 2 12C3.8 16.1 7.5 19 12 19C13.6 19 15.2 18.7 16.7 18.1"
          stroke="#666" strokeWidth="1.7" strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 16C21.1 15 22 13.7 22 12C20.2 7.9 16.5 5 12 5C10.8 5 9.6 5.2 8.5 5.6"
          stroke="#666" strokeWidth="1.7" strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
  </svg>
);

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!form.password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  // ADD THIS BACK
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setMessage("");
    try {
      // 1) LOGIN
      const res = await axiosClient.post("/api/auth/login", form);
      console.log("LOGIN RES:", res.status, res.data);

      const token = res.data.token;
      localStorage.setItem("token", token);

      // 2) ME
      const meRes = await axiosClient.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("ME RES:", meRes.status, meRes.data);

      login({
        id: meRes.data.id,
        name: meRes.data.name,
        email: meRes.data.email,
      });

      navigate("/menu");
    } catch (err) {
      console.error(
        "LOGIN ERROR:",
        err?.response?.status,
        err?.response?.data
      );
      setMessage("Invalid email or password.");
    }
  };


  

  const inputStyle = (field) => ({
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: errors[field] ? "1px solid #e74c3c" : "1px solid #d0d5dd",
    fontSize: "0.97rem",
    outline: "none",
    backgroundColor: "#f9fafb",
  });

  const errorTextStyle = {
    fontSize: "0.78rem",
    color: "#e74c3c",
    marginTop: "3px",
  };

  return (
    <div
      style={{
        maxWidth: "880px",
        margin: "40px auto",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
        gap: "30px",
        alignItems: "stretch",
      }}
    >
      {/* Login form card */}
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          padding: "26px 28px 30px",
          boxShadow: "0 18px 45px rgba(15,23,42,0.16)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <form onSubmit={handleSubmit}
              style={{ width: "100%", maxWidth: "360px" }}>
          <h2 style={{ marginBottom: "10px" }}>Welcome back</h2>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#667085",
              marginBottom: "18px",
            }}
          >
            Login to track orders and reorder your recent favourites.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label
                htmlFor="email"
                style={{
                  fontSize: "0.85rem",
                  color: "#475467",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Email
              </label>
              <input
                id="email"
                style={inputStyle("email")}
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <div style={errorTextStyle}>{errors.email}</div>}
            </div>

            <div>
              <label
                htmlFor="password"
                style={{
                  fontSize: "0.85rem",
                  color: "#475467",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Password
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  id="password"
                  style={{
                    ...inputStyle("password"),
                    paddingRight: "44px",
                    height: "40px",
                    lineHeight: "40px",
                  }}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 0,
                    height: "100%",
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {errors.password && (
                <div style={errorTextStyle}>{errors.password}</div>
              )}
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "11px 0",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "#ff7b00",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Login
          </button>

          {message && (
            <p
              style={{
                marginTop: "12px",
                fontSize: "0.9rem",
                color: "#c0392b",
              }}
            >
              {message}
            </p>
          )}
          <p
            style={{
              marginTop: "10px",
              fontSize: "0.86rem",
              color: "#777",
            }}
          >
            New to FoodieExpress?{" "}
            <a href="/register" style={{ color: "#ff7b00", fontWeight: 500 }}>
              Create an account
            </a>
            .
          </p>
        </form>
      </div>

      {/* Right info panel */}
      <div
        style={{
          borderRadius: "24px",
          padding: "22px 22px 24px",
          background:
            "radial-gradient(circle at top left, #ffb347, #ff7b00 40%, #222 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 26px 60px rgba(15,23,42,0.5)",
        }}
      >
        <h3>Sign in for the full experience</h3>
        <ul
          style={{
            marginTop: "10px",
            fontSize: "0.92rem",
            paddingLeft: "18px",
            lineHeight: 1.7,
          }}
        >
          <li>Track your rider live on the map.</li>
          <li>Save multiple delivery addresses across Sri Lanka.</li>
          <li>View your full order history and repeat in one tap.</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginPage;
