import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_BASE_URL}/dashboard-data`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Gelen data:", data);
        setData(data);
      })
      .catch((err) => {
        console.error("Veri çekme hatası:", err);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Teftiş Dashboard</h1>
        <p>Veriler yükleniyor...</p>
      </div>
    );
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
      <p className="mb-2">{data.karsilama}</p>
      <p>Denetim sayısı: {data.denetim_sayisi}</p>
      <p>Aktif soruşturma: {data.aktif_soruşturma}</p>
      <p>Rolünüz: {data.rol}</p>
    </div>
  );
}
