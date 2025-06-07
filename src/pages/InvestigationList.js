import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export function InvestigationList() {
  const [sorusturmalar, setSorusturmalar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchSorusturmalar = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/sorusturmalar`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Veri çekilemedi. Lütfen tekrar giriş yapın.');
        }
        const data = await response.json();
        setSorusturmalar(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSorusturmalar();
  }, [navigate]);

  if (loading) {
    return <div className="p-8 text-center text-lg">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-lg text-red-600">Hata: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Soruşturmalar</h1>
          <p className="mt-2 text-sm text-gray-700">
            Sistemde kayıtlı tüm soruşturmaların listesi.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
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
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {sorusturma.durum}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">Henüz kayıtlı bir soruşturma bulunmamaktadır.</td>
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