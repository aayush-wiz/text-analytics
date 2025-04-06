import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import DocumentsPage from '../pages/DocumentsPage';
import NewDocumentPage from '../pages/NewDocumentPage';
import EditDocumentPage from '../pages/EditDocumentPage';
import AnalyzePage from '../pages/AnalyzePage';
import ResultsPage from '../pages/ResultsPage';
import SettingsPage from '../pages/SettingsPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes with layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Document routes */}
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/documents/new" element={<NewDocumentPage />} />
          <Route path="/documents/:id" element={<EditDocumentPage />} />

          {/* Analysis routes */}
          <Route path="/texts/:id/analyze" element={<AnalyzePage />} />
          <Route path="/texts/:id/results" element={<ResultsPage />} />

          {/* User routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Admin routes */}
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <div>Users Admin Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/models"
            element={
              <ProtectedRoute requiredRole="admin">
                <div>Models Admin Page</div>
              </ProtectedRoute>
            }
          />

          {/* Error routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/not-found" element={<NotFoundPage />} />
        </Route>

        {/* Redirect home to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
