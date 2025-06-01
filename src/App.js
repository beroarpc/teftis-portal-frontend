import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { InvestigationList } from "./pages/InvestigationList";
import { SoruşturmaDetay } from './pages/SorusturmaDetay';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sorusturmalar" element={<InvestigationList />} />
        <Route path="/sorusturma-detay" element={<InvestigationDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
