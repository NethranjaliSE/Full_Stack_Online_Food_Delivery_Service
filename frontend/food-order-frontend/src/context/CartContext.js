import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]); // [{id, name, price, qty}]

  const addToCart = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQty, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
