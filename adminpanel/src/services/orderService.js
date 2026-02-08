import axios from "axios";

// Updated to match your backend port (usually  based on your previous files)
const API_URL = "/api/orders";

/**
 * Fetches all orders from the backend.
 * Requires ADMIN role.
 */
export const fetchAllOrders = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token for security
    const response = await axios.get(API_URL + "/all", {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token in headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error occurred while fetching the orders", error);
    throw error;
  }
};

/**
 * Updates the status of an order.
 * Triggers driver availability logic if status is 'DELIVERED'.
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token for security
    const response = await axios.patch(
      `${API_URL}/status/${orderId}?status=${status}`,
      {}, // Empty body for PATCH
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in headers
        },
      },
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error occurred while updating the status", error);
    throw error;
  }
};
