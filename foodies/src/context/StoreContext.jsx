import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../service/foodService";
import {
  addToCart,
  getCartData,
  removeQtyFromCart,
} from "../service/cartService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const loadFoods = async () => {
    try {
      const data = await fetchFoodList();
      setFoodList(data);
    } catch (error) {
      console.error("Failed to load food list", error);
    }
  };

  const increaseQty = async (foodId) => {
    const authToken = localStorage.getItem("token");
    if (!authToken) return;

    setQuantities((prev) => ({
      ...prev,
      [foodId]: (prev[foodId] || 0) + 1,
    }));

    await addToCart(foodId, authToken);
  };

  const decreaseQty = async (foodId) => {
    const authToken = localStorage.getItem("token");
    if (!authToken) return;

    setQuantities((prev) => ({
      ...prev,
      [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0,
    }));

    await removeQtyFromCart(foodId, authToken);
  };

  const removeFromCart = (foodId) => {
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[foodId];
      return updated;
    });
  };

  const loadCartData = async () => {
    const authToken = localStorage.getItem("token");
    if (!authToken) return;

    const items = await getCartData(authToken);
    setQuantities(items);
  };

  const contextValue = {
    foodList,
    increaseQty,
    decreaseQty,
    quantities,
    removeFromCart,
    token,
    setToken,
    setQuantities,
    loadCartData,
    fetchFoodList: loadFoods,
  };

  useEffect(() => {
    async function loadData() {
      await loadFoods();
      await loadCartData();
    }
    loadData();
  }, []);

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
