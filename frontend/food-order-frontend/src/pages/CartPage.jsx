import React from "react";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { items, updateQty, total, clearCart } = useCart();

  if (items.length === 0) {
    return <div style={{ maxWidth: 800, margin: "0 auto" }}><h2>Cart</h2><p>Your cart is empty.</p></div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2>Cart</h2>
      {items.map((item) => (
        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: 12, borderRadius: 8, marginBottom: 8 }}>
          <div>
            <div>{item.name}</div>
            <div style={{ fontSize: "0.9rem", color: "#666" }}>Rs. {item.price}</div>
          </div>
          <div>
            <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
            <span style={{ margin: "0 8px" }}>{item.qty}</span>
            <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
          </div>
          <div>Rs. {item.price * item.qty}</div>
        </div>
      ))}
      <h3>Total: Rs. {total}</h3>
      <button onClick={clearCart}>Clear cart</button>
    </div>
  );
};

export default CartPage;
