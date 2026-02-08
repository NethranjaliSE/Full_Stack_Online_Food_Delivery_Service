import React, { useContext } from "react";
import Menubar from "./components/Menubar/Menubar";
import Footer from "./components/Footer/Footer"; // Imported Footer
import { Route, Routes, Navigate } from "react-router-dom";
// Ensure CSS is imported
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import ExploreFood from "./pages/ExploreFood/ExploreFood";
import FoodDetails from "./pages/FoodDetails/FoodDetails";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { ToastContainer } from "react-toastify";
import MyOrders from "./pages/MyOrders/MyOrders";
import DeliveryDashboard from "./pages/DeliveryDashboard/DeliveryDashboard";
import { StoreContext } from "./context/StoreContext";

const App = () => {
  const { token } = useContext(StoreContext);
  const userRole = localStorage.getItem("role");

  return (
    /* We use d-flex flex-column and min-vh-100 to keep footer at the bottom */
    <div className="d-flex flex-column min-vh-100">
      <Menubar />
      <ToastContainer />

      {/* The main content area grows to fill space, pushing footer down */}
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/explore" element={<ExploreFood />} />
          <Route path="/food/:id" element={<FoodDetails />} />
          <Route path="/cart" element={<Cart />} />

          {/* Use Navigate for better redirect behavior */}
          <Route
            path="/order"
            element={token ? <PlaceOrder /> : <Navigate to="/login" />}
          />
          <Route
            path="/myorders"
            element={token ? <MyOrders /> : <Navigate to="/login" />}
          />

          <Route
            path="/login"
            element={token ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/" /> : <Register />}
          />

          {/* Improved Delivery Route Logic */}
          <Route
            path="/delivery-dashboard"
            element={
              token ? (
                userRole === "ROLE_DELIVERY" ? (
                  <DeliveryDashboard />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>

      {/* Footer is placed outside Routes so it appears on all pages */}
      <Footer />
    </div>
  );
};

export default App;
