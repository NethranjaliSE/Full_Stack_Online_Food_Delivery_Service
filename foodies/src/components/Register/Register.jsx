import React, { useState, useContext } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../service/authService";
// 1. Google & Axios Imports
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const Register = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(StoreContext); // Access context to save login

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
      const response = await registerUser(data);
      if (response.status === 201) {
        toast.success("Registration completed. Please login.");
        navigate("/login");
      } else {
        toast.error("Unable to register. Please try again");
      }
    } catch (error) {
      toast.error("Unable to register. Please try again");
    }
  };

  // --- GOOGLE LOGIN HANDLER ---
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // 2. Send token to your Backend on PORT 8081
      const response = await axios.post(
        "http://localhost:8081/api/google-login",
        {
          token: credentialResponse.credential,
        },
      );

      // 3. If backend returns success with a token
      if (response.data && response.data.token) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        toast.success("Login Successful!");
        navigate("/"); // Redirect to Home
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      toast.error("Google Login Failed. Check if backend is running on 8081.");
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
              <h5 className="card-title text-center mb-5 fw-light fs-5">
                Sign Up
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
                    Sign up
                  </button>
                  <button
                    className="btn btn-outline-danger btn-login text-uppercase mt-2"
                    type="reset"
                  >
                    Reset
                  </button>
                </div>

                <hr className="my-4" />

                <div className="d-flex flex-column align-items-center">
                  <p className="text-secondary small mb-3">Or continue with</p>
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
