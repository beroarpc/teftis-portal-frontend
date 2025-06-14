import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';

const API_BASE_URL = "https://teftis-portal-backend-2.onrender.com";

function EditPersonelModal({ isOpen, onClose, onPersonelUpdated, personel }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (personel) {
      setFormData(personel);
    }
  }, [personel]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const loadingToast = toast.loading('Personel bilgileri güncelleniyor...');
    try {
      const response = await fetch(`<span class="math-inline">\{API\_BASE\_URL\}/api/personel/</span>{personel.id}`, {
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
    } finally {
        toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Personel Bilgilerini Düzenle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="sicil_no" placeholder="Sicil No" value={formData.sicil_no || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" name="ad" placeholder="Ad" value={formData.ad || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" name="soyad" placeholder="Soyad" value={formData.soyad || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" name="unvan" placeholder="Unvan" value={formData.unvan || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
          <input type="text" name="sube" placeholder="Şube" value={formData.sube || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
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
  const [formData, setFormData] = useState({
    sicil_no: '',
    ad: '',
    soyad: '',
    unvan: '',
    sube: ''
  });
  const [profilResmi, setProfilResmi] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilResmi(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (profilResmi) {
      data.append('profil_resmi', profilResmi);
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/personel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Personel oluşturulamadı.');
      toast.success(result.message);
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
          <input type="text" name="sicil_no" placeholder="Sicil No" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" name="ad" placeholder="Ad" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" name="soyad" placeholder="Soyad" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" name="unvan" placeholder="Unvan" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
          <input type="text" name="sube" placeholder="Şube" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
          <div>
            <label className="block text-sm font-medium text-gray-700">Profil Resmi</label>
            <input type="file" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          </div>
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
        const response = await fetch(`<span class="math-inline">\{API\_BASE\_URL\}/api/personel/</span>{personelToDelete.id}`, {
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
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Ad Soyad</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sicil No</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Unvan</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Durum</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Eylemler</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {personeller.map((personel) => (
                    <tr key={personel.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        <Link to={`/personel/${personel.id}`} className="text-indigo-600 hover:text-indigo-900">{personel.ad} {personel.soyad}</Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{personel.sicil_no}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{personel.unvan}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${personel.aktif_mi ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'}`}>
                          {personel.aktif_mi ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
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