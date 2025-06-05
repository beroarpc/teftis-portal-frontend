// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

export function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard-data`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Dashboard veri hatası:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Teftiş Dashboard</h1>
      {data ? (
        <div>
          <p>{data.karsilama}</p>
          <p>Toplam Denetim: {data.denetim_sayisi}</p>
          <p>Aktif Soruşturmalar: {data.aktif_soruşturma}</p>
        </div>
      ) : (
        <p>Veriler yükleniyor...</p>
      )}
    </div>
  );
}
