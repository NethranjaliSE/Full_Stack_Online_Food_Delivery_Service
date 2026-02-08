import React, { useContext, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../service/authService";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Login = () => {
  const { setToken, loadCartData } = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
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
      const response = await login(data);

      // Checking for 200 OK and ensuring data exists
      if (response.status === 200 && response.data.token) {
        const { token, role, email } = response.data;

        // 1. Set global state and LocalStorage
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("role", role); // Crucial for routing
        localStorage.setItem("userEmail", email); // Helpful for identifying delivery boy

        // 2. Load user-specific data
        await loadCartData(token);

        toast.success("Login Successful!");

        // 3. ROLE-BASED REDIRECTION LOGIC
        if (role === "ROLE_DELIVERY") {
          navigate("/delivery-dashboard"); // Redirect delivery boys to their task list
        } else if (role === "ROLE_ADMIN") {
          // If they happen to login here, you can redirect to admin URL or a notice
          toast.info("Redirecting to Admin Dashboard...");
          window.location.href = "http://localhost:5174"; // Adjust to your Admin port
        } else {
          navigate("/"); // Standard customer goes to Home
        }
      } else {
        toast.error("Invalid response from server.");
      }
    } catch (error) {
      console.log("Unable to login", error);
      const errorMsg =
        error.response?.data?.message || "Invalid Email or Password";
      toast.error(errorMsg);
    }
  };

  const onResetHandler = () => {
    setData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="login-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">
                Sign In
              </h5>
              <form onSubmit={onSubmitHandler}>
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
                  <label htmlFor="floatingInput">Email address</label>
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
                    Sign in
                  </button>
                  <button
                    className="btn btn-outline-danger btn-login text-uppercase mt-2"
                    type="button"
                    onClick={onResetHandler}
                  >
                    Reset
                  </button>
                </div>
                <div className="mt-4 text-center">
                  Don't have an account? <Link to="/register">Sign up</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
