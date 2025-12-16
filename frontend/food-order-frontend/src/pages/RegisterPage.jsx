import React, { useState } from "react";
import axiosClient from "../api/axiosClient";

const EyeIcon = ({ open }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {open ? (
      <>
        <path
          d="M2 12C3.8 7.9 7.5 5 12 5C16.5 5 20.2 7.9 22 12C20.2 16.1 16.5 19 12 19C7.5 19 3.8 16.1 2 12Z"
          stroke="#666"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="#666" strokeWidth="1.7" />
      </>
    ) : (
      <>
        <path
          d="M3 3L21 21"
          stroke="#666"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M4.5 5.1C3.1 6.3 2 8 2 12C3.8 16.1 7.5 19 12 19C13.6 19 15.2 18.7 16.7 18.1"
          stroke="#666"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 16C21.1 15 22 13.7 22 12C20.2 7.9 16.5 5 12 5C10.8 5 9.6 5.2 8.5 5.6"
          stroke="#666"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
  </svg>
);

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: "+94",
    phoneLocal: "",
    password: "",
    addressLabel: "",
    addressLine1: "",
    city: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.phoneLocal.trim()) {
      newErrors.phoneLocal = "Phone is required";
    } else if (!/^[0-9]{9,10}$/.test(form.phoneLocal)) {
      newErrors.phoneLocal = "Enter number without country code (9–10 digits)";
    }

    if (!form.password || form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

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

    const payload = {
      name: form.name,
      email: form.email,
      phone: `${form.countryCode}${form.phoneLocal}`, // full phone
      password: form.password,
      addresses: [
        {
          label: form.addressLabel,
          line1: form.addressLine1,
          city: form.city,
          postalCode: form.postalCode,
        },
      ],
    };

    try {
      await axiosClient.post("/api/auth/register", payload);
      setMessage("Registered successfully. You can now login.");
    } catch {
      setMessage("Registration failed. Try a different email.");
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
        maxWidth: "960px",
        margin: "40px auto",
        display: "grid",
        gridTemplateColumns: "minmax(0, 5fr) minmax(0, 4fr)",
        gap: "32px",
        alignItems: "stretch",
      }}
    >
      {/* Left visual */}
      <div
        style={{
          borderRadius: "24px",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 26px 60px rgba(15,23,42,0.5)",
        }}
      >
        <img
          src="https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=900"
          alt="Friends enjoying food"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.82)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(255,123,0,0.9), rgba(3,7,18,0.9))",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "24px",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <h2 style={{ fontSize: "2rem", marginBottom: "8px" }}>
            Join FoodieExpress Sri Lanka
          </h2>
          <p style={{ fontSize: "0.95rem", opacity: 0.95 }}>
            From Colombo to Kandy and Galle, get your favourite meals delivered
            fast.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          padding: "26px 26px 30px",
          boxShadow: "0 18px 45px rgba(15,23,42,0.16)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "420px" }}
        >
          <h3 style={{ marginBottom: "8px" }}>Create your account</h3>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#667085",
              marginBottom: "16px",
            }}
          >
            Save your details once and order in just a few taps next time.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <input
                style={inputStyle("name")}
                name="name"
                placeholder="Full name *"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <div style={errorTextStyle}>{errors.name}</div>}
            </div>

            <div>
              <input
                style={inputStyle("email")}
                name="email"
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <div style={errorTextStyle}>{errors.email}</div>}
            </div>

            {/* Phone with country selector */}
            <div>
              <label
                style={{
                  fontSize: "0.85rem",
                  color: "#475467",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Mobile number *
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                <select
                  name="countryCode"
                  value={form.countryCode}
                  onChange={handleChange}
                  style={{
                    width: "130px",
                    padding: "9px 8px",
                    borderRadius: "10px",
                    border: "1px solid #d0d5dd",
                    fontSize: "0.9rem",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <option value="+94">🇱🇰 +94 Sri Lanka</option>
                  <option value="+91">🇮🇳 +91 India</option>
                  <option value="+44">🇬🇧 +44 UK</option>
                </select>
                <input
                  style={inputStyle("phoneLocal")}
                  name="phoneLocal"
                  placeholder="7XXXXXXXX"
                  value={form.phoneLocal}
                  onChange={handleChange}
                />
              </div>
              {errors.phoneLocal && (
                <div style={errorTextStyle}>{errors.phoneLocal}</div>
              )}
            </div>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                    id="password"
                    style={{
                    ...inputStyle("password"),
                    paddingRight: "44px",
                    height: "40px",           // makes box a bit shorter
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
                    height: "100%",          // vertically centers the icon
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    <EyeIcon open={showPassword} />
                </button>
            </div>

            
            

            <div>
              <input
                style={inputStyle("addressLabel")}
                name="addressLabel"
                placeholder="Address label (Home, Work)"
                value={form.addressLabel}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                style={inputStyle("addressLine1")}
                name="addressLine1"
                placeholder="Address line"
                value={form.addressLine1}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                style={inputStyle("city")}
                name="city"
                placeholder="City (Colombo, Kandy...)"
                value={form.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                style={inputStyle("postalCode")}
                name="postalCode"
                placeholder="Postal code"
                value={form.postalCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: "18px",
              width: "100%",
              padding: "11px 0",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "#ff7b00",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Create account
          </button>

          {message && (
            <p
              style={{
                marginTop: "12px",
                fontSize: "0.9rem",
                color: "#444",
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
            Already have an account?{" "}
            <a href="/login" style={{ color: "#ff7b00", fontWeight: 500 }}>
              Login here
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
