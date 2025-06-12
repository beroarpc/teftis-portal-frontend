import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = "https://teftis-portal-backend-2.onrender.com";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
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
        handleLogout();
      }
    };
    fetchDashboardData();
  }, [navigate]);

  if (!data) {
    return <div className="p-6">Yükleniyor...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teftiş Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Çıkış Yap
        </button>
      </div>
      <nav className="mb-6 pb-4 flex flex-col sm:flex-row sm:space-x-6">
        <Link to="/sorusturmalar" className="text-lg text-blue-600 hover:underline font-semibold">
          Soruşturma Yönetimi
        </Link>
        <Link to="/personel" className="text-lg text-blue-600 hover:underline font-semibold mt-2 sm:mt-0">
          Personel Yönetimi
        </Link>
        <Link to="/raporlar" className="text-lg text-blue-600 hover:underline font-semibold mt-2 sm:mt-0">
          Raporlama
        </Link>
        {data.rol === 'başkan' && (
          <Link to="/kullanici-yonetimi" className="text-lg text-blue-600 hover:underline font-semibold mt-2 sm:mt-0">
            Kullanıcı Yönetimi
          </Link>
        )}
      </nav>
      <div className="mt-4">
        <p className="text-xl mb-2">{data.karsilama}</p>
        <p>Denetim sayısı: {data.denetim_sayisi}</p>
        <p>Aktif soruşturma: {data.aktif_soruşturma}</p>
        <p>Rolünüz: {data.rol}</p>
      </div>
    </div>
  );
}