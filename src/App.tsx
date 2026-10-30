import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { RequestProvider } from './context/RequestContext';

import { DemoBanner } from './components/common/DemoBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { LoginPage } from './pages/LoginPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardRouter } from './pages/DashboardRouter';
import { StudentDashboard } from './pages/StudentDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
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
              {/* Authenticated user session & role indicator */}
              <DemoBanner />

              {/* Main navigation header */}
              <Navbar />

              {/* Routed page content with strict RBAC */}
              <main className="flex-1">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  <Route path="/track" element={<QuickTrackPage />} />

                  {/* Unified Dashboard (dynamically renders authorized dashboard based on logged-in role) */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardRouter />
                      </ProtectedRoute>
                    }
                  />

                  {/* Dedicated role-isolated routes: Student can't access Staff/Warden and vice versa */}
                  <Route
                    path="/student"
                    element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudentDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/staff"
                    element={
                      <ProtectedRoute allowedRoles={['staff']}>
                        <StaffDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/warden"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Request management routes */}
                  <Route
                    path="/requests"
                    element={
                      <ProtectedRoute>
                        <RequestsListPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Submit request: Only Students and Admins can create tickets (Staff resolve them) */}
                  <Route
                    path="/requests/new"
                    element={
                      <ProtectedRoute allowedRoles={['student', 'admin']}>
                        <SubmitRequestPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/requests/:id"
                    element={
                      <ProtectedRoute>
                        <RequestDetailPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Fallback */}
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
