import axios from "axios";

// Using the standard URL for your backend
const API_URL = "/api/admin";

/**
 * Fetches all delivery boys who have ROLE_DELIVERY and are marked as available.
 * @returns {Promise<Array>} List of available delivery boy objects.
 */
export const getAvailableDeliveryBoys = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve stored JWT
    const response = await axios.get(`${API_URL}/delivery-boys/available`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching available delivery boys:", error);
    throw error;
  }
};

/**
 * Assigns a specific delivery boy to an order.
 * @param {string} orderId - The ID of the order.
 * @param {string} deliveryBoyId - The ID of the delivery boy.
 * @returns {Promise<Object>} The updated order object.
 */
export const assignDeliveryBoyToOrder = async (orderId, deliveryBoyId) => {
  try {
    const token = localStorage.getItem("token"); // Role-based security check
    const response = await axios.put(
      `${API_URL}/orders/${orderId}/assign/${deliveryBoyId}`,
      {}, // Empty body for PUT request
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning delivery boy:", error);
    throw error;
  }
};
