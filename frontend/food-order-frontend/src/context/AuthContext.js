// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, email }

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:8080/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>
        setUser({
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
        })
      )
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
