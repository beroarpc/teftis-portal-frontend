import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE_URL = "https://teftis-portal-backend-2.onrender.com";

export default function Reports() {
  const [reportData, setReportData] = useState([]);
  const [personeller, setPersoneller] = useState([]);
  const [filters, setFilters] = useState({
    personel_id: '',
    baslangic: '',
    bitis: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPersoneller = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    try {
      const response = await fetch(`${API_BASE_URL}/api/personel`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Personel listesi çekilemedi.');
      const data = await response.json();
      setPersoneller(data);
    } catch (err) {
      toast.error(err.message);
    }
  }, [navigate]);

  useEffect(() => {
    fetchPersoneller();
  }, [fetchPersoneller]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleGetReport = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setReportData([]);
    
    const queryParams = new URLSearchParams(filters).toString();

    try {
      const response = await fetch(`${API_BASE_URL}/api/rapor?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Rapor verisi çekilemedi.');
      const data = await response.json();
      setReportData(data);
      if (data.length === 0) {
        toast.success('Belirtilen kriterlere uygun kayıt bulunamadı.');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Raporlama</h1>
          <p className="mt-2 text-sm text-gray-700">Belirli kriterlere göre soruşturmaları filtreleyin.</p>
        </div>
      </div>

      <div className="mt-6 p-4 border rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label htmlFor="personel_id" className="block text-sm font-medium text-gray-700">Personel</label>
          <select id="personel_id" name="personel_id" value={filters.personel_id} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="">Tüm Personel</option>
            {personeller.map(p => <option key={p.id} value={p.id}>{p.ad} {p.soyad}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="baslangic" className="block text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
          <input type="date" id="baslangic" name="baslangic" value={filters.baslangic} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label htmlFor="bitis" className="block text-sm font-medium text-gray-700">Bitiş Tarihi</label>
          <input type="date" id="bitis" name="bitis" value={filters.bitis} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <button
          type="button"
          onClick={handleGetReport}
          disabled={loading}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-gray-400"
        >
          {loading ? 'Rapor Alınıyor...' : 'Rapor Al'}
        </button>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Soruşturma No</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Konu</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Hakkındaki Personel</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Oluşturma Tarihi</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Onay Durumu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.length > 0 ? (
                    reportData.map((sorusturma) => (
                      <tr key={sorusturma.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{sorusturma.sorusturma_no}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{sorusturma.konu}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{sorusturma.hakkindaki_personel}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{sorusturma.olusturma_tarihi}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{sorusturma.onay_durumu}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">Rapor oluşturmak için lütfen yukarıdan filtre seçin.</td>
                    </tr>
                  )}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}