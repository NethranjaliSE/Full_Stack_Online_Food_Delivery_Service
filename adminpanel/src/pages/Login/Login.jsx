import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Login.css";

const Login = ({ setToken, url }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    try {
      // Calls your updated backend login endpoint
      const response = await axios.post(url + "/api/login", data);

      /**
       * The backend now returns { email, token, role } directly in the body
       * based on the updated AuthenticationResponse.java.
       */
      if (response.data.token) {
        const { token, role } = response.data;

        // Check if the user has the ADMIN role
        if (role === "ROLE_ADMIN") {
          setToken(token);
          // Persist the token and role for route protection
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          toast.success("Welcome Admin");
        } else {
          toast.error("Access Denied. Admins Only.");
        }
      } else {
        toast.error("Invalid response from server.");
      }
    } catch (error) {
      console.error(error);
      // Handle 401 Unauthorized or other errors
      const errorMessage = error.response?.data?.message || "Login Failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Admin Panel</h2>
        <form onSubmit={onLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
