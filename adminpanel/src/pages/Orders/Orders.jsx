import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { fetchAllOrders, updateOrderStatus } from "../../services/orderService";
// Import a service to fetch drivers or use axios directly
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const [data, setData] = useState([]);
  const [drivers, setDrivers] = useState([]); // State for available drivers
  const url = "http://localhost:8081"; // Your backend URL

  const fetchOrders = async () => {
    try {
      const response = await fetchAllOrders();
      setData(response);
    } catch (error) {
      toast.error("Unable to display the orders. Please try again.");
    }
  };

  // NEW: Fetch available delivery boys (ROLE_DELIVERY & isAvailable: true)
  const fetchAvailableDrivers = async () => {
    try {
      const response = await axios.get(
        url + "/api/admin/delivery-boys/available",
      );
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers", error);
    }
  };

  // UPDATED: Use your new assignment endpoint
  const assignDriver = async (orderId, driverId) => {
    if (!driverId) return;
    try {
      await axios.put(url + `/api/orders/${orderId}/assign/${driverId}`);
      toast.success("Driver Assigned!");
      fetchOrders(); // Refresh list to show new status
    } catch (error) {
      toast.error("Failed to assign driver.");
    }
  };

  const updateStatus = async (event, orderId) => {
    const success = await updateOrderStatus(orderId, event.target.value);
    if (success) await fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
    fetchAvailableDrivers(); // Load drivers on mount
  }, []);

  return (
    <div className="container">
      <div className="py-5 row justify-content-center">
        <div className="col-12 card shadow-sm">
          <table className="table table-responsive align-middle">
            <thead>
              <tr>
                <th>Package</th>
                <th>Order Details</th>
                <th>Amount</th>
                <th>Items</th>
                <th>Assign Driver</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <img src={assets.parcel} alt="" height={48} width={48} />
                    </td>
                    <td>
                      <div className="fw-bold">
                        {order.orderedItems.map((item, i) => (
                          <span key={i}>
                            {item.name} x {item.quantity}
                            {i !== order.orderedItems.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                      <div className="text-muted small">
                        {order.userAddress}
                      </div>
                    </td>
                    <td>Rs.{order.amount.toFixed(2)}</td>
                    <td>{order.orderedItems.length}</td>

                    {/* NEW: Driver Assignment Dropdown */}
                    <td>
                      <select
                        className="form-select form-select-sm"
                        onChange={(e) => assignDriver(order.id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select Driver
                        </option>
                        {drivers.map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <select
                        className="form-control form-control-sm"
                        onChange={(event) => updateStatus(event, order.id)}
                        value={order.orderStatus}
                      >
                        <option value="Food Preparing">Food Preparing</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="Out for delivery">
                          Out for delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
