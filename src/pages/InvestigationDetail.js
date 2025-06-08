import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export function InvestigationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sorusturma, setSorusturma] = useState(null);
  const [mufettisler, setMufettisler] = useState([]);
  const [selectedMufettis, setSelectedMufettis] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchPageData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const [sorusturmaRes, mufettislerRes, dashboardRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/sorusturmalar/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/mufettisler`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/dashboard-data`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!sorusturmaRes.ok || !mufettislerRes.ok || !dashboardRes.ok) throw new Error('Veriler çekilemedi.');
      
      const sorusturmaData = await sorusturmaRes.json();
      const mufettislerData = await mufettislerRes.json();
      const dashboardData = await dashboardRes.json();

      setSorusturma(sorusturmaData);
      setMufettisler(mufettislerData);
      setUserInfo(dashboardData);
      if (sorusturmaData.atanan_mufettis) {
          // Bu kısım henüz müfettiş ID'sini döndürmüyor, gelecekte eklenebilir.
          // setSelectedMufettis(sorusturmaData.atanan_mufettis_id);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const handleAssign = async () => {
    if (!selectedMufettis) {
      alert('Lütfen bir müfettiş seçin.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/sorusturmalar/${id}/ata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ mufettis_id: selectedMufettis }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Atama işlemi başarısız.');
      alert(data.message);
      fetchPageData();
    } catch (err) {
      alert(`Hata: ${err.message}`);
    }
  };
  
  const handleFileChange = (event) => { setSelectedFile(event.target.files[0]); };

  const handleUpload = async () => {
    // ... dosya yükleme fonksiyonu aynı ...
  };

  if (loading) return <div className="p-8 text-center text-lg">Yükleniyor...</div>;
  if (error) return <div className="p-8 text-center text-lg text-red-600">Hata: {error}</div>;
  if (!sorusturma || !userInfo) return null;
  
  const onayDurumuClasses = sorusturma.onay_durumu === 'Onaylandı'
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Soruşturma Detayı: {sorusturma.sorusturma_no}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b pb-6">
          {/* ... konu, tarih, durum, onay durumu ... */}
          <div>
            <h3 className="font-semibold text-gray-600">Atanan Müfettiş:</h3>
            <p className="text-gray-800 font-medium">{sorusturma.atanan_mufettis || 'Henüz atanmadı'}</p>
          </div>
        </div>
        
        {userInfo.rol === 'başkan' && (
          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Müfettiş Ata</h3>
            <div className="flex items-center space-x-4">
              <select
                value={selectedMufettis}
                onChange={(e) => setSelectedMufettis(e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Bir müfettiş seçin...</option>
                {mufettisler.map(mufettis => (
                  <option key={mufettis.id} value={mufettis.id}>
                    {mufettis.username}
                  </option>
                ))}
              </select>
              <button onClick={handleAssign} disabled={!selectedMufettis} className="flex-shrink-0 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-gray-400">
                Ata
              </button>
            </div>
          </div>
        )}

        {/* ... Dosya Yönetimi bölümü ... */}
      </div>
    </div>
  );
}
