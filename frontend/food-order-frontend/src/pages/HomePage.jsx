// src/pages/HomePage.jsx
import React from "react";

const HomePage = () => (
  <div style={{ maxWidth: "1160px", margin: "0 auto", paddingBottom: "40px" }}>
    {/* HERO */}
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2.4fr)",
        gap: "40px",
        alignItems: "center",
        padding: "40px 32px",
        background: "linear-gradient(135deg,#ffffff,#fff6eb)",
        borderRadius: "24px",
        boxShadow: "0 26px 60px rgba(0,0,0,0.10)",
        marginTop: "28px",
        overflow: "hidden",
      }}
    >
      <div style={{ animation: "fadeInUp 700ms ease-out" }}>
        <h1
          style={{
            fontSize: "2.7rem",
            lineHeight: 1.1,
            marginBottom: "14px",
          }}
        >
          FoodieExpress brings hot meals to your door in minutes.
        </h1>
        <p style={{ fontSize: "1.05rem", color: "#555", marginBottom: "24px" }}>
          Discover nearby favourites, track your delivery in real time, and
          reorder with a single tap.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <a
            href="/menu"
            style={{
              padding: "11px 24px",
              borderRadius: "999px",
              backgroundColor: "#ff7b00",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
              boxShadow: "0 10px 24px rgba(255,123,0,0.55)",
            }}
          >
            Browse menu
          </a>
          <a
            href="/register"
            style={{
              padding: "11px 24px",
              borderRadius: "999px",
              border: "1px solid #ddd",
              color: "#222",
              backgroundColor: "#fff",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Create account
          </a>
        </div>

        <div style={{ display: "flex", gap: "18px", marginTop: "22px" }}>
          <div style={{ fontSize: "0.9rem", color: "#555" }}>
            <strong style={{ display: "block", fontSize: "1.1rem" }}>500+</strong>
            Daily orders
          </div>
          <div style={{ fontSize: "0.9rem", color: "#555" }}>
            <strong style={{ display: "block", fontSize: "1.1rem" }}>4.9★</strong>
            Average rating
          </div>
          <div style={{ fontSize: "0.9rem", color: "#555" }}>
            <strong style={{ display: "block", fontSize: "1.1rem" }}>30 min</strong>
            Avg. delivery time
          </div>
        </div>
      </div>

      {/* HERO ILLUSTRATION / ANIMATED CARD */}
      <div
        style={{
          position: "relative",
          minHeight: "260px",
          animation: "floatIn 900ms ease-out",
        }}
      >
        {/* Background image – replace with your own later */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "999px",
            backgroundImage:
              "url('https://images.pexels.com/photos/3186654/pexels-photo-3186654.jpeg?auto=compress&cs=tinysrgb&w=800')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.7)",
          }}
        />
        {/* Overlay gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "999px",
            background:
              "radial-gradient(circle at top left, rgba(255,179,71,0.8), transparent 55%)",
          }}
        />
        {/* Delivery card */}
        <div
          style={{
            position: "absolute",
            left: "18%",
            right: "12%",
            bottom: "18%",
            padding: "16px 18px",
            borderRadius: "18px",
            backgroundColor: "#fff",
            boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
            animation: "cardFloat 3s ease-in-out infinite",
          }}
        >
          <div style={{ fontSize: "0.9rem", color: "#777" }}>
            Delivering to <strong>Kiribathgoda</strong>
          </div>
          <div style={{ marginTop: 6, fontWeight: 600 }}>Rider is 8 minutes away</div>
          <div style={{ marginTop: 4, fontSize: "0.85rem", color: "#777" }}>
            Order #2315 &middot; Chicken Fried Rice + Drink
          </div>
        </div>
      </div>
    </section>

    {/* CATEGORIES / FEATURE CARDS */}
    <section style={{ padding: "32px 4px 0" }}>
      <h2 style={{ marginBottom: "16px" }}>Everything you crave, in one place</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "18px",
        }}
      >
        {[
          {
            title: "Rice & Kottu",
            desc: "Sri Lankan favourites ready for lunch and dinner.",
          },
          {
            title: "Cakes & Desserts",
            desc: "Birthday cakes, brownies and sweet treats.",
          },
          {
            title: "Short Eats",
            desc: "Samosas, rolls and snacks for tea time.",
          },
          {
            title: "Drinks",
            desc: "Fresh juices, soft drinks and coffee.",
          },
        ].map((c) => (
          <div
            key={c.title}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "16px 18px",
              boxShadow: "0 10px 26px rgba(0,0,0,0.04)",
              transition: "transform 150ms ease, box-shadow 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 26px rgba(0,0,0,0.04)";
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{c.title}</div>
            <div style={{ fontSize: "0.92rem", color: "#666" }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default HomePage;
