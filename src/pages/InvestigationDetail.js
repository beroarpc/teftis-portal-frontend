import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
      const response = await fetch(`<span class="math-inline">\{API\_BASE\_URL\}/api/sorusturmalar/</span>{id}`, {
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
      const response = await fetch(`<span class="math-inline">\{API\_BASE\_URL\}/api/sorusturmalar/</span>{id}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error('Dosya yüklenemedi.');
      alert('Dosya başarıyla yüklendi!');
      setSelectedFile(null); // Dosya seçimini temizle
      fetchDetails(); // Sayfayı ve dosya listesini yenile
    } catch (err) {
      alert(`Hata: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-lg">Yükleniyor...</div>;
  if (error) return <div className="p-8 text-center text-lg text-red-600">Hata: {error}</div>;
  if (!sorusturma) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Soruşturma Detayı: {sorusturma.sorusturma_no}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                    <h3 className="font-semibold