import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ComparePage from './pages/ComparePage';
import PriceTrackerPage from './pages/PriceTrackerPage';
import TimingHackPage from './pages/TimingHackPage';
import ValueForMoneyPage from './pages/ValueForMoneyPage';
import PriceAlertsPage from './pages/PriceAlertsPage';
import SalesCalendarPage from './pages/SalesCalendarPage';
import RefurbishedPage from './pages/RefurbishedPage';
import AboutPage from './pages/AboutPage';
import { AlertProvider, useAlerts } from './context/AlertContext';
import { CheckCircle2, X } from 'lucide-react';

function NotificationToast() {
  const { latestNotification, clearNotification } = useAlerts();

  if (!latestNotification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-[#15803D] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 text-xs font-semibold">
      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
      <span>{latestNotification}</span>
      <button 
        type="button" 
        onClick={clearNotification}
        className="p-1 hover:bg-emerald-800 rounded transition-colors ml-2"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/tracker" element={<PriceTrackerPage />} />
          <Route path="/timing-hack" element={<TimingHackPage />} />
          <Route path="/value-score" element={<ValueForMoneyPage />} />
          <Route path="/alerts" element={<PriceAlertsPage />} />
          <Route path="/sales" element={<SalesCalendarPage />} />
          <Route path="/refurbished" element={<RefurbishedPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <NotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <AlertProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AlertProvider>
  );
}
