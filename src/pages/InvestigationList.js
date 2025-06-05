import React from "react";
import { Link } from "react-router-dom";

export function InvestigationList() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Soruşturma Listesi</h2>
      <ul className="list-disc pl-6">
        <li><Link to="/sorusturma-detay">Personel A - Uyarı</Link></li>
        <li><Link to="/sorusturma-detay">Personel B - Kınama</Link></li>
        <li><Link to="/sorusturma-detay">Personel C - Açığa Alma</Link></li>
      </ul>
    </div>
  );
}
