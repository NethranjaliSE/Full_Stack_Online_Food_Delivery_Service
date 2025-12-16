// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <main
            style={{
              padding: "24px",
              backgroundColor: "#f7f7f7",
              minHeight: "100vh",
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </main>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
