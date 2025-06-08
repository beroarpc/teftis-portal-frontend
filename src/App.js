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
  }, [id, navigate]);

  useEffect(() => {
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
      toast.success(data.message); // alert() yerine toast.success()
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
}
 