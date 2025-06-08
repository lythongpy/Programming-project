import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';

import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';
import UserDashboard from '../pages/User/UserDashboard';
import ClientDashboard from '../pages/Client/ClientDashboard';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import MainHomepage from '../pages/Home/Mainhomepage';

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
  const unprotectedRoutes = ['/', '/register', '/login'];
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;
    if (!user && !unprotectedRoutes.includes(currentPath)) {
      navigate('/login');
    }
  });
  return () => unsubscribe();
}, [navigate]);


  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<MainHomepage />} />

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
  );
}

export default AppRoutes;
