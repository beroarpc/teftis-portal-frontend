import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Giriş başarısız");

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (error) {
      alert("Kullanıcı adı veya şifre hatalı.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Teftiş Giriş</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Kullanıcı Adı" value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 p-2 border rounded" />
          <input type="password" placeholder="Şifre" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border rounded" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
