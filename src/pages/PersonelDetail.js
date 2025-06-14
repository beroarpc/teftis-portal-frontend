import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE_URL = "https://teftis-portal-backend-2.onrender.com";

export function PersonelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [personel, setPersonel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/personel/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Personel detayları çekilemedi.');
      const data = await response.json();
      setPersonel(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (loading) return <div className="p-8 text-center text-lg">Yükleniyor...</div>;
  if (error) return <div className="p-8 text-center text-lg text-red-600">Hata: {error}</div>;
  if (!personel) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Link to="/personel" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          &larr; Personel Listesine Geri Dön
        </Link>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-5xl mx-auto">
        <div className="flex items-center space-x-6 mb-8 pb-8 border-b">
          <img
            className="h-24 w-24 rounded-full object-cover ring-4 ring-white"
            src={personel.profil_resmi_url || 'https://placehold.co/100x100/e2e8f0/e2e8f0?text=.'}
            alt="Profil Resmi"
          />
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{personel.ad} {personel.soyad}</h2>
            <p className="text-lg text-gray-600">{personel.unvan}</p>
            <p className="text-sm text-gray-500">Sicil No: {personel.sicil_no}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Sicil Bilgileri</h3>
                <div className="space-y-3">
                    <p><span className="font-semibold">Şube:</span> {personel.sube || 'Belirtilmemiş'}</p>
                    <p><span className="font-semibold">İşe Başlama Tarihi:</span> {personel.ise_baslama_tarihi || 'Belirtilmemiş'}</p>
                    <p><span className="font-semibold">Durum:</span> 
                        <span className={`ml-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${personel.aktif_mi ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'}`}>
                          {personel.aktif_mi ? 'Aktif' : 'Pasif'}
                        </span>
                    </p>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">İlişkili Soruşturmalar</h3>
                {personel.sorusturmalar.length > 0 ? (
                    <ul className="divide-y divide-gray-200 border rounded-md">
                    {personel.sorusturmalar.map(s => (
                        <li key={s.id} className="px-4 py-3">
                            <Link to={`/sorusturma-detay/${s.id}`} className="text-indigo-600 hover:underline">{s.sorusturma_no} - {s.konu}</Link>
                        </li>
                    ))}
                    </ul>
                ) : <p className="text-gray-500">İlişkili soruşturma bulunamadı.</p>}
            </div>
        </div>
      </div>
    </div>
  );
}