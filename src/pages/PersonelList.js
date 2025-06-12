import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';

const API_BASE_URL = "https://teftis-portal-backend-2.onrender.com";

function EditPersonelModal({ isOpen, onClose, onPersonelUpdated, personel }) {
  const [formData, setFormData] = useState(personel);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(personel);
  }, [personel]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/personel/${personel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Personel güncellenemedi.');
      toast.success(data.message);
      onPersonelUpdated();
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Personel Bilgilerini Düzenle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="sicil_no" placeholder="Sicil No" value={formData.sicil_no} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" name="ad" placeholder="Ad" value={formData.ad} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" name="soyad" placeholder="Soyad" value={formData.soyad} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" name="unvan" placeholder="Unvan" value={formData.unvan} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          <div className="flex items-center justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">İptal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Güncelle</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddPersonelModal({ isOpen, onClose, onPersonelAdded }) {
  const [sicilNo, setSicilNo] = useState('');
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [unvan, setUnvan] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!sicilNo || !ad || !soyad) {
      setError('Sicil No, Ad ve Soyad alanları zorunludur.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/personel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ sicil_no: sicilNo, ad, soyad, unvan }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Personel oluşturulamadı.');
      toast.success(data.message);
      onPersonelAdded();
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Yeni Personel Ekle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Sicil No" value={sicilNo} onChange={(e) => setSicilNo(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" placeholder="Ad" value={ad} onChange={(e) => setAd(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" placeholder="Soyad" value={soyad} onChange={(e) => setSoyad(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" placeholder="Unvan" value={unvan} onChange={(e) => setUnvan(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          <div className="flex items-center justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">İptal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PersonelList() {
  const [personeller, setPersoneller] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPersonel, setEditingPersonel] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [personelToDelete, setPersonelToDelete] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const fetchInitialData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    setLoading(true);
    try {
      const [personelRes, dashboardRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/personel`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/dashboard-data`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (!personelRes.ok || !dashboardRes.ok) throw new Error('Veri çekilemedi.');
      const personelData = await personelRes.json();
      const dashboardData = await dashboardRes.json();
      setPersoneller(personelData);
      setUserRole(dashboardData.rol);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => { fetchInitialData(); }, [fetchInitialData]);

  const handleEditClick = (personel) => {
    setEditingPersonel(personel);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteClick = (personel) => {
    setPersonelToDelete(personel);
    setIsConfirmOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!personelToDelete) return;
    const token = localStorage.getItem('token');
    const loadingToast = toast.loading(`${personelToDelete.ad} siliniyor...`);
    try {
        const response = await fetch(`${API_BASE_URL}/api/personel/${personelToDelete.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        toast.success(data.message);
        fetchInitialData();
    } catch(err) {
        toast.error(err.message);
    } finally {
        toast.dismiss(loadingToast);
        setIsConfirmOpen(false);
        setPersonelToDelete(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-lg">Yükleniyor...</div>;
  if (error) return <div className="p-8 text-center text-lg text-red-600">Hata: {error}</div>;

  return (
    <>
      <AddPersonelModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onPersonelAdded={fetchInitialData} />
      {editingPersonel && <EditPersonelModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onPersonelUpdated={fetchInitialData} personel={editingPersonel} />}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Personeli Sil"
        message={`'${personelToDelete?.ad} ${personelToDelete?.soyad}' adlı personeli silmek (pasif hale getirmek) istediğinizden emin misiniz?`}
        confirmButtonText="Evet, Sil"
      />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">Personel Sicil Yönetimi</h1>
            <p className="mt-2 text-sm text-gray-700">Sistemde kayıtlı tüm personellerin listesi.</p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            {userRole === 'başkan' && (
              <button type="button" onClick={() => setIsAddModalOpen(true)} className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">Yeni Personel Ekle</button>
            )}
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Sicil No</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ad</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Soyad</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Unvan</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Durum</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Eylemler</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {personeller.map((personel) => (
                    <tr key={personel.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{personel.sicil_no}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{personel.ad}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{personel.soyad}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{personel.unvan}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{personel.aktif_mi ? 'Aktif' : 'Pasif'}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        {userRole === 'başkan' && (
                            <div className="flex gap-x-4">
                                <button onClick={() => handleEditClick(personel)} className="text-indigo-600 hover:text-indigo-900">Düzenle</button>
                                <button onClick={() => handleDeleteClick(personel)} className="text-red-600 hover:text-red-900">Sil</button>
                            </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}