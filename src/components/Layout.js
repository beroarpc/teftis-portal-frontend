import React, { useEffect, useState, useCallback } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE_URL = "https://teftis-portal-backend-2.onrender.com";

export default function Layout() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard-data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Oturum süresi doldu veya geçersiz. Lütfen tekrar giriş yapın.");
      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      toast.error(error.message);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [location.key]); // Sayfa her değiştiğinde kullanıcı bilgisini tekrar çek

  const handleLogout = () => {
    toast.success('Başarıyla çıkış yapıldı.');
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!userInfo) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div>Yükleniyor...</div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img className="h-8 w-auto" src="/favicon.ico" alt="Şirket Logosu" />
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Teftiş Kurulu Başkanlığı Portalı
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          >
            Çıkış Yap
          </button>
        </div>
      </header>
      
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-12 items-center justify-start space-x-6">
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Anasayfa</Link>
                <Link to="/sorusturmalar" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Soruşturmalar</Link>
                <Link to="/personel" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Personel</Link>
                {userInfo.rol === 'başkan' && (
                    <>
                        <Link to="/raporlar" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Raporlama</Link>
                        <Link to="/kullanici-yonetimi" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Kullanıcı Yönetimi</Link>
                    </>
                )}
            </div>
        </div>
      </nav>
      
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}