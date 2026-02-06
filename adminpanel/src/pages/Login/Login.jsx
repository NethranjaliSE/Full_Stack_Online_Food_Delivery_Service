import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Login.css"; // We will create this next

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
      // Calls your updated backend login
      const response = await axios.post(url + "/api/user/login", data);

      if (response.data.success) {
        // Check if the user is an ADMIN (optional safety check)
        if (response.data.data.role === "ADMIN") {
          setToken(response.data.data.token);
          toast.success("Welcome Admin");
        } else {
          toast.error("Access Denied. Admins Only.");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Login Failed");
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
