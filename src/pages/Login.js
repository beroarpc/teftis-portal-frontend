import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const API_BASE_URL = "https://teftis-portal-backend-2.onrender.com";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Giriş yapılıyor...');
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Giriş başarılı!');
        localStorage.setItem("token", data.access_token);
        navigate("/dashboard");
      } else {
        throw new Error(data.message || "Giriş başarısız.");
      }
    } catch (error) {
      toast.error(error.message || "Sunucuya bağlanılamadı.");
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-6">
          <img 
            className="h-12 w-auto mb-4" 
            src="/logo.png" 
            alt="Şirket Logosu" 
          />
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Teftiş Kurulu Başkanlığı Giriş
          </h2>
        </div>
        
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-md" required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded-md" required
        />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400">
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
}