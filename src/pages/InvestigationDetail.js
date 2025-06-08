import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import toast from 'react-hot-toast';

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
      if (sorusturmaData.atanan_mufettis_id) {
          setSelectedMufettis(sorusturmaData.atanan_mufettis_id);
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
      return toast.error('Lütfen bir müfettiş seçin.');
    }
    const token = localStorage.getItem('token');
    const loadingToast = toast.loading('Atama yapılıyor...');
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
      toast.success(data.message);
      fetchPageData();
    } catch (err) {
      toast.error(`Hata: ${err.message}`);
    } finally {
      toast.dismiss(loadingToast);
    }
  };
  
  const handleFileChange = (event) => { setSelectedFile(event.target.files[0]); };

  const handleUpload = async () => {
    if (!selectedFile) {
      return toast.error('Lütfen bir dosya seçin.');
    }
    setUploading(true);
    const loadingToast = toast.loading('Dosya yükleniyor...');
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
      toast.success('Dosya başarıyla yüklendi!');
      setSelectedFile(null);
      fetchPageData();
    } catch (err) {
      toast.error(`Hata: ${err.message}`);
    } finally {
      setUploading(false);
      toast.dismiss(loadingToast);
    }
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
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${onayDurumuClasses}`}>
                        {sorusturma.onay_durumu}
                    </span>
                </div>
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
                    className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300"
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