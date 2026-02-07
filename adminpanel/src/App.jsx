import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AddFood from "./pages/AddFood/AddFood";
import ListFood from "./pages/ListFood/ListFood";
import Orders from "./pages/Orders/Orders";
import Login from "./pages/Login/Login"; // Ensure this path is correct
import Sidebar from "./components/Sidebar/Sidebar";
import Menubar from "./components/Menubar/Menubar";
import { ToastContainer } from "react-toastify";

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  // Check for existing token in localStorage to keep user logged in on refresh
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const url = "http://localhost:8081"; // Your Backend URL

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Update localStorage whenever the token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  }, [token]);

  // If there is no token, show only the Login page
  if (!token) {
    return (
      <>
        <ToastContainer />
        <Login setToken={setToken} url={url} />
      </>
    );
  }

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar sidebarVisible={sidebarVisible} />

      <div id="page-content-wrapper">
        <Menubar toggleSidebar={toggleSidebar} setToken={setToken} />
        <ToastContainer />

        <div className="container-fluid">
          <Routes>
            <Route path="/add" element={<AddFood url={url} />} />
            <Route path="/list" element={<ListFood url={url} />} />
            <Route path="/orders" element={<Orders url={url} />} />
            {/* Redirect root to list if logged in */}
            <Route path="/" element={<Navigate to="/list" />} />
            {/* Catch-all for undefined routes */}
            <Route path="*" element={<Navigate to="/list" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
