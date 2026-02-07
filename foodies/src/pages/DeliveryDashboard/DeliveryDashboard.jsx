import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import axios from "axios";
import "./DeliveryDashboard.css";
import {
  getMyOrders,
  toggleAvailability as toggleService,
} from "../../service/deliveryService";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(StoreContext);
  const url = "http://localhost:8081";

  // 1. DISCOVERY LOGIC
  const syncDriver = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email || !token) return;
    try {
      const res = await axios.get(
        `${url}/api/delivery/user-by-email/${email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      localStorage.setItem("userId", res.data.id);
      setIsAvailable(res.data.available);
      return res.data.id;
    } catch (e) {
      console.error("Sync failed", e);
    }
  };

  const fetchOrders = async (id) => {
    try {
      const data = await getMyOrders(id);
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // 2. STATUS UPDATE LOGIC
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${url}/api/delivery/orders/${orderId}/status?status=${newStatus}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success(`Status updated: ${newStatus}`);
      fetchOrders(localStorage.getItem("userId"));
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  // 3. ACCEPT/REJECT LOGIC
  const handleResponse = async (orderId, accept) => {
    try {
      await axios.patch(
        `${url}/api/delivery/orders/${orderId}/respond?accept=${accept}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success(accept ? "Job Accepted!" : "Job Rejected");
      fetchOrders(localStorage.getItem("userId"));
    } catch (e) {
      toast.error("Action failed");
    }
  };

  useEffect(() => {
    const init = async () => {
      let id = localStorage.getItem("userId");
      if (!id || id === "undefined") id = await syncDriver();
      if (id) fetchOrders(id);
    };
    if (token) init();
  }, [token]);

  if (loading)
    return <div className="text-center mt-5">Loading Dashboard...</div>;

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white shadow-sm rounded">
        <h3 className="m-0">Delivery Console</h3>
        <button
          className={`btn fw-bold ${isAvailable ? "btn-success" : "btn-danger"}`}
          onClick={async () => {
            const id = localStorage.getItem("userId");
            await toggleService(id, !isAvailable);
            setIsAvailable(!isAvailable);
          }}
        >
          {isAvailable ? "🟢 Online" : "🔴 Busy"}
        </button>
      </div>

      {/* Orders */}
      <div className="row">
        {orders.length === 0 ? (
          <div className="text-center text-muted mt-5">
            No active orders found.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id || order._id} className="col-12 mb-3">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <span className="fw-bold">
                    Order #{String(order.id).slice(-4)}
                  </span>
                  <span className="badge bg-primary">{order.orderStatus}</span>
                </div>

                <div className="card-body">
                  <p className="mb-1">
                    <strong>Address:</strong> {order.userAddress}
                  </p>
                  <p className="mb-3">
                    <strong>Amount:</strong> Rs.{order.amount}
                  </p>

                  {/* --- BUTTON LOGIC (SIMPLIFIED) --- */}

                  {/* 1. SHOW ACCEPT/REJECT (If status is Assigned OR Pending) */}
                  {(order.deliveryAcceptanceStatus === "PENDING" ||
                    order.orderStatus === "Assigned") && (
                    <div className="d-flex gap-2 mb-2">
                      <button
                        className="btn btn-success flex-fill"
                        onClick={() => handleResponse(order.id, true)}
                      >
                        ✅ Accept Job
                      </button>
                      <button
                        className="btn btn-outline-danger flex-fill"
                        onClick={() => handleResponse(order.id, false)}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}

                  {/* 2. SHOW START DELIVERY (If Confirmed) */}
                  {order.orderStatus === "Driver Confirmed" && (
                    <button
                      className="btn btn-warning w-100 fw-bold text-dark"
                      onClick={() =>
                        handleStatusUpdate(order.id, "Out for delivery")
                      }
                    >
                      🚀 Start Delivery
                    </button>
                  )}

                  {/* 3. SHOW COMPLETE DELIVERY (If Out for Delivery) */}
                  {order.orderStatus === "Out for delivery" && (
                    <button
                      className="btn btn-primary w-100 fw-bold"
                      onClick={() => handleStatusUpdate(order.id, "Delivered")}
                    >
                      🏁 Complete Delivery
                    </button>
                  )}

                  {/* 4. SHOW COMPLETED (If Delivered) */}
                  {order.orderStatus === "Delivered" && (
                    <div className="alert alert-success text-center m-0 p-2 fw-bold">
                      🎉 Job Completed
                    </div>
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
