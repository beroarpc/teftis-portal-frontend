import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import InvestigationList from "./pages/InvestigationList";
import { InvestigationDetail } from "./pages/InvestigationDetail";
import PersonelList from "./pages/PersonelList";
import Reports from "./pages/Reports";

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sorusturmalar" element={<InvestigationList />} />
        <Route path="/sorusturma-detay/:id" element={<InvestigationDetail />} />
        <Route path="/personel" element={<PersonelList />} />
        <Route path="/raporlar" element={<Reports />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}
export default App;