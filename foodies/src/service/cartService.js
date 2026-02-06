import axios from "axios";

const API_URL = "http://localhost:8081/api/cart";

// helper to get token safely
const getAuthHeader = (token) => {
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const addToCart = async (foodId, token) => {
  if (!token) return;

  try {
    await axios.post(API_URL, { foodId }, { headers: getAuthHeader(token) });
  } catch (error) {
    console.error("Error while adding the cart data", error);
  }
};

export const removeQtyFromCart = async (foodId, token) => {
  if (!token) return;

  try {
    await axios.post(
      API_URL + "/remove",
      { foodId },
      { headers: getAuthHeader(token) },
    );
  } catch (error) {
    console.error("Error while removing qty from cart", error);
  }
};

export const getCartData = async (token) => {
  if (!token) return {};

  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader(token),
    });
    return response.data.items || {};
  } catch (error) {
    console.error("Error while fetching the cart data", error);
    return {};
  }
};

export const clearCartItems = async (token, setQuantities) => {
  if (!token) {
    setQuantities({});
    return;
  }

  try {
    await axios.delete(API_URL, {
      headers: getAuthHeader(token),
    });
    setQuantities({});
  } catch (error) {
    console.error("Error while clearing the cart", error);
    throw error;
  }
};
