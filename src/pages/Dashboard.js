// src/pages/Dashboard.js

import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Token'ı temizle
    navigate("/"); // Login ekranına yönlendir
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Teftiş Dashboard</h1>
      <p className="mb-4">Hoş geldiniz, sayın başkanım.</p>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Çıkış Yap
      </button>
    </div>
  );
}
