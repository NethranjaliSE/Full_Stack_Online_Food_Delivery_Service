import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import AddFood from "./pages/AddFood/AddFood";
import ListFood from "./pages/ListFood/ListFood";
import Orders from "./pages/Orders/Orders";
import Login from "./pages/Login/Login";
import DeliveryList from "./pages/DeliveryList/DeliveryList";
import Reviews from "./pages/Reviews/Reviews"; // New Import

// Components
import Sidebar from "./components/Sidebar/Sidebar";
import Menubar from "./components/Menubar/Menubar";

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  // Get token from storage to persist login
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const url = "";

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  }, [token]);

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
            {/* 1. Main Features */}
            <Route path="/add" element={<AddFood url={url} />} />
            <Route path="/list" element={<ListFood url={url} />} />
            <Route path="/orders" element={<Orders url={url} />} />

            {/* 2. Delivery Management */}
            <Route path="/delivery-list" element={<DeliveryList url={url} />} />

            {/* 3. Customer Reviews (MOVED UP) */}
            <Route path="/reviews" element={<Reviews url={url} />} />

            {/* 4. Redirects (Must be last) */}
            <Route path="/" element={<Navigate to="/list" />} />
            <Route path="*" element={<Navigate to="/list" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
