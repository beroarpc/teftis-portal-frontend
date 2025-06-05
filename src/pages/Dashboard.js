// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/dashboard-data`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          // Token geçersizse logout
          localStorage.removeItem("token");
          navigate("/login");
        }
        return res.json();
      })
      .then((data) => setData(data))
      .catch((error) => {
        console.error("Veri alınamadı:", error);
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!data) {
    return <div className="p-6">Veriler yükleniyor...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Teftiş Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Çıkış Yap
        </button>
      </div>
      <p>{data.karsilama}</p>
      <p>Denetim sayısı: {data.denetim_sayisi}</p>
      <p>Aktif soruşturma: {data.aktif_soruşturma}</p>
    </div>
  );
}
