import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { RequestProvider } from './context/RequestContext';

import { DemoBanner } from './components/common/DemoBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

import { LandingPage } from './pages/LandingPage';
import { DashboardRouter } from './pages/DashboardRouter';
import { RequestsListPage } from './pages/RequestsListPage';
import { SubmitRequestPage } from './pages/SubmitRequestPage';
import { RequestDetailPage } from './pages/RequestDetailPage';
import { QuickTrackPage } from './pages/QuickTrackPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <RequestProvider>
            <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 font-sans selection:bg-[#7A1528]/15 selection:text-[#7A1528]">
              {/* Demo disclaimer and quick persona bar */}
              <DemoBanner />

              {/* Main navigation header */}
              <Navbar />

              {/* Routed page content */}
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<DashboardRouter />} />
                  <Route path="/requests" element={<RequestsListPage />} />
                  <Route path="/requests/new" element={<SubmitRequestPage />} />
                  <Route path="/requests/:id" element={<RequestDetailPage />} />
                  <Route path="/track" element={<QuickTrackPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              {/* Campus footer */}
              <Footer />
            </div>
          </RequestProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
