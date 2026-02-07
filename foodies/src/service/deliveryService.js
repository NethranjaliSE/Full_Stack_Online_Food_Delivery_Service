import axios from "axios";

const getToken = () => localStorage.getItem("token");
const API_BASE_URL = "http://localhost:8081/api";
const DELIVERY_URL = `${API_BASE_URL}/delivery`;

// 1. DISCOVERY: Fetch User Profile by Email
// Fixed URL to match DeliveryController: /api/delivery/user-by-email/{email}
export const getUserByEmail = async (email) => {
  const token = getToken();
  // Note: We are hitting the Delivery Controller endpoint now
  const response = await axios.get(`${DELIVERY_URL}/user-by-email/${email}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 2. NEW: Accept or Reject an Assigned Order
export const respondToOrder = async (orderId, accept) => {
  const token = getToken();
  const response = await axios.patch(
    `${DELIVERY_URL}/orders/${orderId}/respond?accept=${accept}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

// 3. Get My Orders
export const getMyOrders = async (deliveryBoyId) => {
  const token = getToken();
  const response = await axios.get(
    `${DELIVERY_URL}/my-orders/${deliveryBoyId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

// 4. Toggle Availability
export const toggleAvailability = async (userId, isAvailable) => {
  const token = getToken();
  const response = await axios.patch(
    `${DELIVERY_URL}/availability/${userId}?isAvailable=${isAvailable}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

// 5. Update Order Status (e.g., Delivered)
export const updateOrderStatus = async (orderId, newStatus) => {
  const token = getToken();
  const response = await axios.patch(
    `${DELIVERY_URL}/orders/${orderId}/status?status=${newStatus}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};
