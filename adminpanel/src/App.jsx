import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import AddFood from "./pages/AddFood/AddFood";
import ListFood from "./pages/ListFood/ListFood";
import Orders from "./pages/Orders/Orders";
import Login from "./pages/Login/Login";
import DeliveryList from "./pages/DeliveryList/DeliveryList"; // 1. NEW IMPORT

// Components
import Sidebar from "./components/Sidebar/Sidebar";
import Menubar from "./components/Menubar/Menubar";

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const url = "http://localhost:8081";

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
            <Route path="/add" element={<AddFood url={url} />} />
            <Route path="/list" element={<ListFood url={url} />} />
            <Route path="/orders" element={<Orders url={url} />} />

            {/* 2. NEW ROUTE FOR DELIVERY LIST */}
            <Route path="/delivery-list" element={<DeliveryList url={url} />} />

            <Route path="/" element={<Navigate to="/list" />} />
            <Route path="*" element={<Navigate to="/list" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
