import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { InvestigationList } from "./pages/InvestigationList";
import { InvestigationDetail } from "./pages/InvestigationDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sorusturmalar" element={<InvestigationList />} />
        <Route path="/sorusturma-detay/:id" element={<InvestigationDetail />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;