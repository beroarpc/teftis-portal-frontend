import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout'; // Yeni Layout'u import et
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import InvestigationList from "./pages/InvestigationList";
import { InvestigationDetail } from "./pages/InvestigationDetail";
import PersonelList from "./pages/PersonelList";
import Reports from "./pages/Reports";
import UserManagement from "./pages/UserManagement";

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Login sayfası tam ekran, Layout kullanmıyor */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        {/* Diğer tüm sayfalar Layout şablonunu kullanacak */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sorusturmalar" element={<InvestigationList />} />
          <Route path="/sorusturma-detay/:id" element={<InvestigationDetail />} />
          <Route path="/personel" element={<PersonelList />} />
          <Route path="/raporlar" element={<Reports />} />
          <Route path="/kullanici-yonetimi" element={<UserManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
