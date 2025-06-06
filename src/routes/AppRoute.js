import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';
import UserDashboard from '../pages/User/UserDashboard';
import ClientDashboard from '../pages/Client/ClientDashboard';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<LoginPage />} />

        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute allowedRole="user">
              <DashboardLayout>
                <UserDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/client"
          element={
            <ProtectedRoute allowedRole="client">
              <DashboardLayout>
                <ClientDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
