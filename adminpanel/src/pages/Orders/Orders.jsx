import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { fetchAllOrders, updateOrderStatus } from "../../services/orderService";
import axios from "axios";
import { toast } from "react-toastify";
import "./Orders.css";

const Orders = ({ url }) => {
  // Ensure 'url' is received as a prop
  const [data, setData] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]); // Renamed for clarity

  // Use the token for secure requests
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const response = await fetchAllOrders();
      setData(response);
    } catch (error) {
      toast.error("Unable to display the orders.");
    }
  };

  // ✅ FIX: This function fetches ONLY drivers with status "Available: true"
  // ✅ FIX: This function fetches ONLY drivers with status "Available: true"
  const fetchAvailableDrivers = async () => {
    try {
      // Calling the specific endpoint for online drivers
      const response = await axios.get(
        `${url}/api/admin/delivery-boys/available`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setAvailableDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers", error);
    }
  };

  const assignDriver = async (orderId, driverId) => {
    if (!driverId) return;
    try {
      await axios.put(
        `${url}/api/admin/orders/${orderId}/assign/${driverId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Driver Assigned!");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to assign driver.");
    }
  };

  const updateStatus = async (event, orderId) => {
    const success = await updateOrderStatus(orderId, event.target.value);
    if (success) await fetchOrders();
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchAvailableDrivers();
    }
  }, [token]);

  // Helper for status badges
  const getAcceptanceBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return <span className="badge bg-success ms-2">Confirmed</span>;
      case "REJECTED":
        return <span className="badge bg-danger ms-2">Rejected</span>;
      case "PENDING":
        return <span className="badge bg-warning text-dark ms-2">Pending</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container py-5">
      <h3>Order Management</h3>
      <div className="table-responsive">
        <table className="table table-hover align-middle shadow-sm bg-white rounded">
          <thead className="table-dark">
            <tr>
              <th>Item</th>
              <th>Details</th>
              <th>Amount</th>
              <th>Assign Driver (Online Only)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, index) => (
              <tr key={index}>
                <td style={{ width: "60px" }}>
                  <img src={assets.parcel} alt="" width={50} />
                </td>
                <td>
                  <p className="mb-1 fw-bold">
                    {order.orderedItems.map((item, i) => (
                      <span key={i}>
                        {item.name} x {item.quantity}
                        {i !== order.orderedItems.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                  <p className="mb-0 small text-muted">
                    {order.userAddress} <br />
                    <strong>{order.userName}</strong>
                  </p>
                </td>
                <td>Rs.{order.amount.toFixed(2)}</td>

                <td style={{ minWidth: "250px" }}>
                  <div className="d-flex flex-column gap-2">
                    {/* ✅ DROPDOWN: Only shows drivers from 'availableDrivers' list */}
                    <select
                      className="form-select form-select-sm"
                      onChange={(e) => assignDriver(order.id, e.target.value)}
                      value={order.deliveryBoyId || ""}
                      disabled={order.deliveryAcceptanceStatus === "ACCEPTED"}
                    >
                      <option value="" disabled>
                        Select Online Driver
                      </option>

                      {availableDrivers.length === 0 && (
                        <option disabled>No drivers online</option>
                      )}

                      {availableDrivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          🟢 {driver.name}
                        </option>
                      ))}
                    </select>

                    {order.deliveryBoyId && (
                      <div className="small">
                        Status:{" "}
                        {getAcceptanceBadge(order.deliveryAcceptanceStatus)}
                      </div>
                    )}
                  </div>
                </td>

                <td>
                  <select
                    className="form-select form-select-sm"
                    onChange={(event) => updateStatus(event, order.id)}
                    value={order.orderStatus}
                  >
                    <option value="Placed">Placed</option>
                    <option value="Food Preparing">Food Preparing</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Driver Confirmed">Driver Confirmed</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
