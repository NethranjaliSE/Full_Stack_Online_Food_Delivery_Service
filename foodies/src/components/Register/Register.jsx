import React, { useState, useContext } from "react";
import "./Register.css";
import { Link, useNavigate, useLocation } from "react-router-dom"; // 1. Import useLocation
import { toast } from "react-toastify";
import { registerUser } from "../../service/authService";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 2. Hook to receive data from Menubar
  const { setToken } = useContext(StoreContext);

  // 3. Determine the Role (Default to USER if not clicked via "Deliver with us")
  const targetRole = location.state?.role || "ROLE_USER";

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // 4. Create a specific payload including the ROLE
      const registrationData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: targetRole, // <--- IMPORTANT: Sending role to backend
      };

      // Pass the updated object to your service
      const response = await registerUser(registrationData);

      if (response.status === 201 || response.status === 200) {
        toast.success(
          `Registration successful! Welcome ${
            targetRole === "ROLE_DELIVERY" ? "Driver" : "User"
          }. Please Login.`,
        );
        navigate("/login");
      } else {
        toast.error("Unable to register. Please try again");
      }
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Check backend console.");
    }
  };

  // --- GOOGLE LOGIN HANDLER ---
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/api/google-login",
        {
          token: credentialResponse.credential,
          // Optional: If your backend supports creating Drivers via Google, pass it here too
          // role: targetRole
        },
      );

      if (response.data && response.data.token) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        // Save the role returned from backend so we know where to redirect
        localStorage.setItem("role", response.data.role);

        toast.success("Login Successful!");
        navigate("/");
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      toast.error("Google Login Failed.");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Login Failed");
  };

  return (
    <div className="register-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              {/* 5. Dynamic Title based on Role */}
              <h5 className="card-title text-center mb-5 fw-light fs-5">
                {targetRole === "ROLE_DELIVERY"
                  ? "Driver Registration"
                  : "Sign Up"}
              </h5>

              <form onSubmit={onSubmitHandler}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingName"
                    placeholder="Jhon Doe"
                    name="name"
                    onChange={onChangeHandler}
                    value={data.name}
                    required
                  />
                  <label htmlFor="floatingName">Full Name</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    name="email"
                    onChange={onChangeHandler}
                    value={data.email}
                    required
                  />
                  <label htmlFor="floatingInput">Email</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    name="password"
                    onChange={onChangeHandler}
                    value={data.password}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="d-grid">
                  <button
                    className="btn btn-outline-primary btn-login text-uppercase"
                    type="submit"
                  >
                    {targetRole === "ROLE_DELIVERY"
                      ? "Register as Driver"
                      : "Sign up"}
                  </button>
                  <button
                    className="btn btn-outline-danger btn-login text-uppercase mt-2"
                    type="reset"
                  >
                    Reset
                  </button>
                </div>

                <hr className="my-4" />

                {/* Hide Google Login for Drivers if your backend doesn't support Google-Driver-Signup yet */}
                {targetRole !== "ROLE_DELIVERY" && (
                  <div className="d-flex flex-column align-items-center">
                    <p className="text-secondary small mb-3">
                      Or continue with
                    </p>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="outline"
                      size="large"
                      width="300"
                      text="signup_with"
                      shape="pill"
                    />
                  </div>
                )}

                <div className="mt-4 text-center">
                  Already have an account? <Link to="/login">Sign In</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
