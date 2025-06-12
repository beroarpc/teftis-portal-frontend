import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';

const API_BASE_URL = "https://teftis-portal-backend-2.onrender.com";

function AddUserModal({ isOpen, onClose, onUserAdded }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('müfettiş');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password || !rol) {
      setError('Tüm alanlar zorunludur.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ username, password, rol }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Kullanıcı oluşturulamadı.');
      toast.success(data.message);
      onUserAdded();
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Yeni Kullanıcı Ekle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Kullanıcı Adı" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          <select value={rol} onChange={(e) => setRol(e.target.value)} className="w-full px-3 py-2 border rounded-md">
            <option value="müfettiş">Müfettiş</option>
            <option value="müfettiş yardımcısı">Müfettiş Yardımcısı</option>
          </select>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-md">İptal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        if(response.status === 403) navigate('/dashboard');
        throw new Error('Kullanıcı listesi çekilemedi.');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    const token = localStorage.getItem('token');
    const loadingToast = toast.loading(`${userToDelete.username} siliniyor...`);
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userToDelete.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        toast.success(data.message);
        fetchUsers();
    } catch(err) {
        toast.error(err.message);
    } finally {
        toast.dismiss(loadingToast);
        setIsConfirmOpen(false);
        setUserToDelete(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-lg">Yükleniyor...</div>;
  if (error) return <div className="p-8 text-center text-lg text-red-600">Hata: {error}</div>;

  return (
    <>
      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUserAdded={fetchUsers} />
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Kullanıcıyı Sil"
        message={`'${userToDelete?.username}' adlı kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        confirmButtonText="Evet, Sil"
      />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">Kullanıcı Yönetimi</h1>
            <p className="mt-2 text-sm text-gray-700">Sistemdeki tüm kullanıcıların listesi.</p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button type="button" onClick={() => setIsModalOpen(true)} className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">Yeni Kullanıcı Ekle</button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Kullanıcı Adı</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rol</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Sil</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{user.username}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.rol}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      {user.rol !== 'başkan' && (
                        <button onClick={() => handleDeleteClick(user)} className="text-red-600 hover:text-red-900">Sil</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}