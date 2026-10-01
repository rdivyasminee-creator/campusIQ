import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Energy from './pages/Energy';
import Water from './pages/Water';
import AirQuality from './pages/AirQuality';
import Waste from './pages/Waste';
import Assets from './pages/Assets';
import Maintenance from './pages/Maintenance';
import Alerts from './pages/Alerts';
import CampusMap from './pages/CampusMap';
import Reports from './pages/Reports';
import AdminSettings from './pages/AdminSettings';
import IoTSimulator from './pages/IoTSimulator';

import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('niis_authenticated') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('niis_authenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('niis_authenticated');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          
          <Route path="/" element={isAuthenticated ? <AdminLayout onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="simulator" element={<IoTSimulator />} />
            <Route path="energy" element={<Energy />} />
            <Route path="water" element={<Water />} />
            <Route path="air-quality" element={<AirQuality />} />
            <Route path="waste" element={<Waste />} />
            <Route path="assets" element={<Assets />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="map" element={<CampusMap />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
