import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { SoruşturmaListesi } from "./pages/SorusturmaListesi";
import { SoruşturmaDetay } from "./pages/SorusturmaDetay";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sorusturmalar" element={<SoruşturmaListesi />} />
        <Route path="/sorusturma-detay" element={<SoruşturmaDetay />} />
      </Routes>
    </Router>
  );
}

export default App;

