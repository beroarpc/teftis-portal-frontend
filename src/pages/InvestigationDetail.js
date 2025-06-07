import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export function InvestigationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sorusturma, setSorusturma] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDetails = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/sorusturmalar/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Soruşturma detayları çekilemedi.');
      const data = await response.json();
      setSorusturma(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Lütfen bir dosya seçin.');
      return;
    }
    setUploading(true);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/sorusturmalar/${id}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error('Dosya yüklenemedi.');
      alert('Dosya başarıyla yüklendi!');
      setSelectedFile(null);
      fetchDetails();
    } catch (err) {
      alert(`Hata: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-lg">Yükleniyor...</div>;
  if (error) return <div className="p-8 text-center text-lg text-red-600">Hata: {error}</div>;
  if (!sorusturma) return null;

  // Hatanın olduğu yerdeki kod, daha güvenli olması için basitleştirildi.
  const baseOnayClasses = "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset";
  const dynamicOnayClasses = sorusturma.onay_durumu === 'Onaylandı'
    ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
    : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Link to="/sorusturmalar" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          &larr; Soruşturma Listesine Geri Dön
        </Link>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Soruşturma Detayı: {sorusturma.sorusturma_no}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b pb-6">
          <div>
            <h3 className="font-semibold text-gray-600">Konu:</h3>
            <p className="text-gray-800">{sorusturma.konu}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-600">Oluşturma Tarihi:</h3>
            <p className="text-gray-800">{sorusturma.olusturma_tarihi}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-600">Durum:</h3>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{sorusturma.durum}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-600">Onay Durumu:</h3>
            <span className={`${baseOnayClasses} ${dynamicOnayClasses}`}>
              {sorusturma.onay_durumu}
            </span>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Dosya Yönetimi</h3>
          <div className="p-4 border rounded-lg bg-gray-50">
            <h4 className="font-semibold text-gray-700 mb-3">Yeni Dosya Yükle</h4>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="flex-shrink-0 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-400"
              >
                {uploading ? 'Yükleniyor...' : 'Yükle'}
              </button>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-3">Yüklenmiş Dosyalar</h4>
            {sorusturma.dosyalar.length > 0 ? (
              <ul className="divide-y divide-gray-200 border rounded-md">
                {sorusturma.dosyalar.map(dosya => (
                  <li key={dosya.id} className="px-4 py-3 flex justify-between items-center">
                    <span className="text-gray-700">{dosya.dosya_adi}</span>
                    <a href={dosya.dosya_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Görüntüle / İndir
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Bu soruşturmaya henüz dosya yüklenmemiş.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}