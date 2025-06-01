import React from "react";

export function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Teftiş Giriş</h2>
        <input type="text" placeholder="Kullanıcı Adı" className="w-full mb-4 p-2 border rounded" />
        <input type="password" placeholder="Şifre" className="w-full mb-4 p-2 border rounded" />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Giriş Yap</button>
      </div>
    </div>
  );
}
