import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE_URL = "https://teftis-portal-backend-2.onrender.com";

function AddCezaModal({ isOpen, onClose, onCezaAdded, sorusturmaId }) {
  const [cezaTuru, setCezaTuru] = useState('');
  const [verilmeTarihi, setVerilmeTarihi] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!cezaTuru || !verilmeTarihi) {
      setError('Ceza Türü ve Verilme Tarihi alanları zorunludur.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/sorusturmalar/${sorusturmaId}/ceza-ekle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
            ceza_turu: cezaTuru,
            verilme_tarihi: verilmeTarihi,
            aciklama: aciklama
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Ceza eklenemedi.');
      }
      toast.success(data.message);
      onCezaAdded();
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Soruşturmaya Ceza Ekle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Ceza Türü (Örn: Uyarı)" value={cezaTuru} onChange={(e) => setCezaTuru(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          <div>
            <label htmlFor="verilmeTarihi" className="block text-sm font-medium text-gray-700">Verilme Tarihi</label>
            <input type="date" id="verilmeTarihi" value={verilmeTarihi} onChange={(e) => setVerilmeTarihi(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          </div>
          <textarea placeholder="Açıklama (İsteğe Bağlı)" rows="3" value={aciklama} onChange={(e) => setAciklama(e.target.value)} className="w-full px-3 py-2 border rounded-md"></textarea>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">İptal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Cezayı Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}


export function InvestigationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sorusturma, setSorusturma] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCezaModalOpen, setIsCezaModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const fetchDetails = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const [sorusturmaRes, dashboardRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/sorusturmalar/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/dashboard-data`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (!sorusturmaRes.ok || !dashboardRes.ok) throw new Error('Soruşturma detayları çekilemedi.');
      
      const sorusturmaData = await sorusturmaRes.json();
      const dashboardData = await dashboardRes.json();

      setSorusturma(sorusturmaData);
      setUserInfo(dashboardData);
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
  if (!sorusturma || !userInfo) return null;

  return (
    <>
      <AddCezaModal 
        isOpen={isCezaModalOpen} 
        onClose={() => setIsCezaModalOpen(false)} 
        onCezaAdded={fetchDetails}
        sorusturmaId={id}
      />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <Link to="/sorusturmalar" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            &larr; Soruşturma Listesine Geri Dön
          </Link>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Soruşturma Detayı: {sorusturma.sorusturma_no}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b pb-6">
            <p><span className="font-semibold">Hakkındaki Personel:</span> {sorusturma.hakkindaki_personel}</p>
            <p><span className="font-semibold">Atanan Müfettiş:</span> {sorusturma.atanan_mufettis || 'Henüz atanmadı'}</p>
            <p><span className="font-semibold">Konu:</span> {sorusturma.konu}</p>
            <p><span className="font-semibold">Oluşturma Tarihi:</span> {sorusturma.olusturma_tarihi}</p>
          </div>

          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Ceza Kayıtları</h3>
              {userInfo.rol === 'başkan' && (
                <button
                  onClick={() => setIsCezaModalOpen(true)}
                  className="rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                >
                  Yeni Ceza Ekle
                </button>
              )}
            </div>
            {sorusturma.cezalar && sorusturma.cezalar.length > 0 ? (
              <ul className="divide-y divide-gray-200 border rounded-md">
                {sorusturma.cezalar.map(ceza => (
                  <li key={ceza.id} className="px-4 py-3">
                    <p className="font-semibold">{ceza.ceza_turu} <span className="font-normal text-gray-500">- {ceza.verilme_tarihi}</span></p>
                    <p className="text-sm text-gray-600 mt-1">{ceza.aciklama}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Bu soruşturmaya ilişkin ceza kaydı bulunmamaktadır.</p>
            )}
          </div>

          <div className="border-t pt-6 mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Yüklenmiş Dosyalar</h3>
            {sorusturma.dosyalar && sorusturma.dosyalar.length > 0 ? (
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
    </>
  );
}