// src/pages/Dashboard.js

import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Teftiş Dashboard</h1>
      <p>Hoş geldiniz, sayın başkanım.</p>
      <p><Link to="/sorusturmalar" className="text-blue-600 underline">Soruşturmaları Görüntüle</Link></p>
    </div>
  );
}
