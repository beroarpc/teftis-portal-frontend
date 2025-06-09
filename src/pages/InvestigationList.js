import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE_URL = "https://teftis-portal-backend-2.onrender.com";

function AddInvestigationModal({ isOpen, onClose, onInvestigationAdded }) {
  const [sorusturmaNo, setSorusturmaNo] = useState('');
  const [konu, setKonu] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!sorusturmaNo || !konu) {
      setError('Soruşturma No ve Konu alanları zorunludur.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/sorusturmalar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sorusturma_no: sorusturmaNo, konu: konu }),
      });
      if (!response.ok) {
        throw new Error('Soruşturma oluşturulamadı.');
      }
      toast.success('Soruşturma başarıyla eklendi!');
      onInvestigationAdded();
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Yeni Soruşturma Ekle</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="sorusturmaNo" className="block text-sm font-medium text-gray-700">Soruşturma No</label>
            <input
              type="text"
              id="sorusturmaNo"
              value={sorusturmaNo}
              onChange={(e) => setSorusturmaNo(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="konu" className="block text-sm font-medium text-gray-700">Konu</label>
            <textarea
              id="konu"
              rows="4"
              value={konu}
              onChange={(e) => setKonu(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            ></textarea>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex items-center justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              İptal
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InvestigationList() {
  const [sorusturmalar, setSorusturmalar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const fetchInitialData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const [sorusturmalarRes, dashboardRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/sorusturmalar`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/dashboard-data`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (!sorusturmalarRes.ok || !dashboardRes.ok) {
        throw new Error('Veri çekilemedi.');
      }
      const sorusturmalarData = await sorusturmalarRes.json();
      const dashboardData = await dashboardRes.json();
      setSorusturmalar(sorusturmalarData);
      setUserRole(dashboardData.rol);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);
  
  const handleOnayla = async (sorusturmaId) => {
    const token = localStorage.getItem('token');
    const loadingToast = toast.loading('Onaylanıyor...');
    try {
        const response = await fetch(`${API_BASE_URL}/api/sorusturmalar/${sorusturmaId}/onayla`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Onaylama işlemi başarısız.');
        toast.success("Soruşturma onaylandı!");
        fetchInitialData();
    } catch(err) {
        toast.error(err.message);
    } finally {
        toast.dismiss(loadingToast);
    }
  };

  const handleInvestigationAdded = () => {
    fetchInitialData();
  };

  if (loading) return <div className="p-8 text-center text-lg">Yükleniyor...</div>;
  if (error) return <div className="p-8 text-center text-lg text-red-600">Hata: {error}</div>;

  return (
    <>
      <AddInvestigationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvestigationAdded={handleInvestigationAdded}
      />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">Soruşturmalar</h1>
            <p className="mt-2 text-sm text-gray-700">Sistemde kayıtlı tüm soruşturmaların listesi.</p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            {(userRole === 'başkan' || userRole === 'müfettiş') && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Yeni Soruşturma Ekle
              </button>
            )}
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Soruşturma No</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Konu</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Oluşturma Tarihi</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Durum</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Onay Durumu</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Onayla</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sorusturmalar.length > 0 ? (
                    sorusturmalar.map((sorusturma) => (
                      <tr key={sorusturma.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          <Link to={`/sorusturma-detay/${sorusturma.id}`} className="text-blue-600 hover:underline">
                            {sorusturma.sorusturma_no}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{sorusturma.konu}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{sorusturma.olusturma_tarihi}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{sorusturma.durum}</span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                           {sorusturma.onay_durumu === 'Onaylandı' ? (
                              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">{sorusturma.onay_durumu}</span>
                           ) : (
                              <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">{sorusturma.onay_durumu}</span>
                           )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                           {userRole === 'başkan' && sorusturma.onay_durumu === 'Onay Bekliyor' && (
                             <button onClick={() => handleOnayla(sorusturma.id)} className="text-indigo-600 hover:text-indigo-900">Onayla</button>
                           )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-gray-500">Henüz kayıtlı bir soruşturma bulunmamaktadır.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}