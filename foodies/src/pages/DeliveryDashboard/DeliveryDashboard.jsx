import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import "./DeliveryDashboard.css";

const DeliveryDashboard = () => {
  // 1. Initialize as an empty array []
  const [orders, setOrders] = useState([]);
  const { url, token } = useContext(StoreContext);

  const deliveryBoyId = localStorage.getItem("userEmail");

  const fetchMyOrders = async () => {
    if (!token) return; // Guard clause
    try {
      const response = await axios.get(
        `${url}/api/delivery/my-orders/${deliveryBoyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // 2. CRITICAL FIX: Check response structure
      // Sometimes backend sends { success: true, data: [...] }
      // Sometimes it sends just [...]
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        setOrders(response.data.data);
      } else if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        console.warn("API did not return an array:", response.data);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching tasks", error);
      toast.error("Failed to load delivery tasks.");
      setOrders([]); // Safety fallback
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${url}/api/delivery/orders/${orderId}/status?status=${newStatus}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success(`Order marked as ${newStatus}`);
      fetchMyOrders(); // Refresh the list
    } catch (error) {
      console.error(error);
      toast.error("Status update failed.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyOrders();
    }
  }, [token]);

  return (
    <div className="delivery-dashboard-container">
      <div className="dashboard-header">
        <h2>
          <i className="bi bi-truck me-2"></i>Delivery Partner Dashboard
        </h2>
        <p>
          Manage your assigned deliveries and update order status in real-time.
        </p>
      </div>

      <div className="order-list">
        {/* 3. SAFETY CHECK: Ensure orders is an array before checking length */}
        {!Array.isArray(orders) || orders.length === 0 ? (
          <div className="no-orders">
            <i className="bi bi-clipboard-check fs-1"></i>
            <p>No active deliveries assigned to you yet.</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="delivery-card shadow-sm">
              <div className="card-top">
                <span className="order-id">
                  {/* Handle _id or id safely */}
                  Order ID: #
                  {order._id ? order._id.slice(-6) : order.id?.slice(-6)}
                </span>
                <span
                  className={`status-badge ${order.orderStatus?.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="card-body">
                <div className="info-row">
                  <i className="bi bi-person"></i>
                  <span>{order.email}</span>
                </div>
                <div className="info-row">
                  <i className="bi bi-geo-alt"></i>
                  <span>{order.userAddress}</span>
                </div>
                <div className="info-row">
                  <i className="bi bi-telephone"></i>
                  <span>{order.phoneNumber}</span>
                </div>
                <div className="items-list">
                  <strong>Items:</strong>{" "}
                  {order.orderedItems
                    .map((item) => `${item.name} (x${item.quantity})`)
                    .join(", ")}
                </div>
              </div>

              <div className="card-footer">
                <span className="amount">
                  {/* Optional chaining for amount */}
                  Total: Rs.{order.amount ? order.amount.toFixed(2) : "0.00"}
                </span>
                <div className="action-buttons">
                  {/* Only show 'Start Delivery' if status is Preparing or Assigned */}
                  {(order.orderStatus === "ASSIGNED" ||
                    order.orderStatus === "Preparing") && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          order._id || order.id,
                          "Out for delivery",
                        )
                      }
                      className="btn btn-primary btn-sm"
                    >
                      Start Delivery
                    </button>
                  )}
                  {order.orderStatus === "Out for delivery" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(order._id || order.id, "Delivered")
                      }
                      className="btn btn-success btn-sm"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
