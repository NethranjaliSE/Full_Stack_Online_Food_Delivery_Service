import React from "react";

const sampleItems = [
  { id: "1", name: "Chicken Fried Rice", price: 1200, category: "Rice" },
  { id: "2", name: "Cheese Kottu", price: 1000, category: "Kottu" },
  { id: "3", name: "Chocolate Cake Slice", price: 450, category: "Cakes" },
];

const MenuPage = () => {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h2>Menu</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {sampleItems.map((item) => (
          <div
            key={item.id}
            style={{
              background: "white",
              padding: "16px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
            <div style={{ color: "#666", fontSize: "0.85rem" }}>{item.category}</div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>Rs. {item.price}</div>
            <button
              style={{
                marginTop: 10,
                padding: "6px 12px",
                borderRadius: "999px",
                border: "none",
                backgroundColor: "#ff7b00",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
