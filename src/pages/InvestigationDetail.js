import React from "react";

export function InvestigationDetail() {
  const sorusturmaDetayi = {
    sorusturma_no: "2025/1",
    konu: "Personel A hakkında görevi ihmal iddiası.",
    olusturma_tarihi: "2025-06-07 14:30:00",
    durum: "Açık",
    detaylar: "Personel A hakkında 12.05.2025 tarihinde CİMER üzerinden gelen şikayet üzerine, görevi ihmal ve suiistimal iddialarını araştırmak üzere disiplin soruşturması başlatılmıştır."
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Soruşturma Detayı: {sorusturmaDetayi.sorusturma_no}
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-600">Konu:</h3>
          <p className="text-gray-800">{sorusturmaDetayi.konu}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-600">Oluşturma Tarihi:</h3>
          <p className="text-gray-800">{sorusturmaDetayi.olusturma_tarihi}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-600">Durum:</h3>
          <p>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              {sorusturmaDetayi.durum}
            </span>
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-600">Açıklamalar:</h3>
          <p className="text-gray-800 leading-relaxed">{sorusturmaDetayi.detaylar}</p>
        </div>
      </div>
    </div>
  );
}