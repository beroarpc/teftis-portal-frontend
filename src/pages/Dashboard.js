import React, { useEffect, useState } from "react";


const API_BASE_URL = "https://teftis-portal-backend-2.onrender.com";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/dashboard-data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Yetki hatası");
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        console.error("Dashboard veri hatası:", error);
      }
    };
    fetchDashboardData();
  }, []); // Bağımlılık dizisi boş

  if (!data) {
    return <div className="p-6">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{data.karsilama}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">Denetim Sayısı</p>
            <p className="text-2xl font-bold text-blue-900">{data.denetim_sayisi}</p>
        </div>
         <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">Aktif Soruşturma</p>
            <p className="text-2xl font-bold text-yellow-900">{data.aktif_soruşturma}</p>
        </div>
         <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-800">Rolünüz</p>
            <p className="text-2xl font-bold text-gray-900">{data.rol}</p>
        </div>
      </div>
    </div>
  );
}